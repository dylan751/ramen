import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, Repository } from 'typeorm';
import { Role, User } from 'src/db/entities';
import { PaginationOptions } from 'src/modules/common/interfaces/pagination-options';
import { UserSortField } from 'src/modules/organizations/users/dto/user-pagination-request.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findByOrganization(organizationUniqueName: string): Promise<User[]> {
    const queryBuilder = this.createQueryBuilder('user')
      .innerJoinAndSelect('user.organization', 'organization')
      .where('organization.uniqueName = :organizationUniqueName', {
        organizationUniqueName,
      });

    return await queryBuilder.getMany();
  }

  async findByEmail(email: string): Promise<User> {
    return await this.findOne({ where: { email: email } });
  }

  async findById(id: number): Promise<User> {
    return await this.findOne({ where: { id: id } });
  }

  async findByIdWithOrganizations(id: number): Promise<User> {
    const user = await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.userOrganizations', 'userOrganization')
      .leftJoinAndSelect('userOrganization.organization', 'organization')
      .leftJoinAndSelect('userOrganization.roles', 'roles')
      .where('user.id = :userId')
      .setParameters({ userId: id })
      .getOne();

    if (user) {
      user.organizations = user.userOrganizations.map(
        (userOrg) => userOrg.organization,
      );
    }

    return user;
  }

  async findByIdWithOrganizationsAndRoles(id: number): Promise<User> {
    return await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.userOrganizations', 'userOrganization')
      .leftJoinAndSelect('userOrganization.organization', 'organization')
      .leftJoinAndSelect('userOrganization.roles', 'roles')
      .where('user.id = :userId')
      .setParameters({
        userId: id,
      })
      .getOne();
  }

  async findByOrganizationWithOrganizations(
    organizationId: number,
  ): Promise<User[]> {
    const query = this.createQueryBuilder('user')
      .leftJoinAndSelect('user.userOrganizations', 'userOrganization')
      .where('userOrganization.organizationId = :organizationId', {
        organizationId,
      });
    const users = await query.getMany();
    return await Promise.all(
      users.map(async (user) => {
        const userWithOrganizations = await this.createQueryBuilder('user')
          .leftJoinAndSelect('user.userOrganizations', 'userOrganization')
          .leftJoinAndSelect('userOrganization.organization', 'organization')
          .where('user.id = :userId', { userId: user.id })
          .getOne();
        user.organizations = userWithOrganizations.userOrganizations.map(
          (userOrg) => userOrg.organization,
        );
        return user;
      }),
    );
  }

  async findByOrganizationWithUserOrgRole(
    organizationId: number,
    options?: PaginationOptions,
    search?: string,
    disableRoleSearch = false,
  ): Promise<User[]> {
    // the arguments of skip, take, orderBy can be undefined
    let query = this.createQueryBuilder('user')
      .innerJoinAndSelect('user.userOrganizations', 'userOrganization')
      .innerJoinAndSelect('userOrganization.roles', 'role')
      .where('userOrganization.organizationId = :organizationId', {
        organizationId,
      });
    console.log(await query.getQuery());

    if (search) {
      // FIXME: this query will become slow in the future
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('user.name LIKE :search', { search: `%${search}%` }).orWhere(
            'user.email LIKE :search',
            {
              search: `%${search}%`,
            },
          );
          if (!disableRoleSearch) {
            // TODO: replace with role filter from FE
            // get roles that match the search and get userIds that have these roles
            qb.orWhere(
              new Brackets((subQb) => {
                const userIdsWithRoles = query
                  .subQuery()
                  .select('user.id')
                  .from(User, 'user')
                  .innerJoin('user.userOrganizations', 'userOrganization')
                  .innerJoin('userOrganization.roles', 'role')
                  .where('role.name LIKE :search', { search: `%${search}%` })
                  .getQuery();
                subQb.where('user.id IN ' + userIdsWithRoles);
              }),
            );
          }
        }),
      );
    }

    if (options) {
      let sortExpression: string;
      if (options.sortField === UserSortField.ROLE) {
        sortExpression = 'role.name';
      } else if (options.sortField === UserSortField.STATUS) {
        sortExpression = 'userOrganization.status';
      } else {
        sortExpression = `user.${options.sortField}`;
      }

      query = query
        .skip(options?.offset)
        .take(options?.limit)
        .orderBy(sortExpression, options?.order);
    }

    return await query.getMany();
  }

  async countUserInOrganization(
    organizationId: number,
    search?: string,
  ): Promise<number> {
    let query = this.createQueryBuilder('user')
      .leftJoinAndSelect('user.userOrganizations', 'userOrganization')
      .leftJoinAndSelect('userOrganization.roles', 'role')
      .where('userOrganization.organizationId = :organizationId', {
        organizationId,
      });

    if (search) {
      // FIXME: this query will become slow in the future
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where('user.name LIKE :search', { search: `%${search}%` })
            .orWhere('user.email LIKE :search', { search: `%${search}%` })
            .orWhere('role.slug LIKE :search', { search: `%${search}%` });
        }),
      );
    }

    return await query.getCount();
  }

  async findManyWithUserOrganization(
    organizationId: number,
    emails?: string[],
  ): Promise<User[]> {
    const queryBuilder = this.createQueryBuilder('user').leftJoinAndSelect(
      'user.userOrganizations',
      'userOrganization',
      'userOrganization.organizationId = :organizationId',
    );

    if (emails) {
      queryBuilder.where('user.email IN (:emails)');
    }

    return queryBuilder.setParameters({ organizationId, emails }).getMany();
  }

  async findActiveAdmin(organizationId: number): Promise<User[]> {
    const query = this.createQueryBuilder('user')
      .leftJoinAndSelect(
        'user.userOrganizations',
        'userOrganization',
        'userOrganization.organizationId = :organizationId',
      )
      .leftJoin('userOrganization.roles', 'role')
      .where('role.id = :adminId');
    return query
      .setParameters({ organizationId, adminId: Role.ADMIN_ROLE_ID })
      .getMany();
  }

  async findOrganizationFirstAdmin(organizationId: number): Promise<User> {
    const query = this.createQueryBuilder('user')
      .leftJoinAndSelect('user.userOrganizations', 'userOrganization')
      .leftJoin('userOrganization.roles', 'role')
      .where('userOrganization.organizationId = :organizationId')
      .andWhere('role.id = :adminId')
      .orderBy('userOrganization.createdAt', 'ASC');
    return query
      .setParameters({ organizationId, adminId: Role.ADMIN_ROLE_ID })
      .getOne();
  }
}
