import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, Repository } from 'typeorm';
import { Role, User } from 'src/db/entities';
import { PaginationOptions } from 'src/modules/common/interfaces/pagination-options';

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
      .leftJoinAndSelect('user.organization', 'organization')
      .where('user.id = :userId')
      .setParameters({ userId: id })
      .getOne();

    return user;
  }

  async findByIdWithOrganizationsAndRoles(id: number): Promise<User> {
    return await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.organization', 'organization')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.id = :userId')
      .setParameters({
        userId: id,
      })
      .getOne();
  }

  async findByOrganizationWithUserOrgRole(
    organizationId: number,
    options?: PaginationOptions,
    search?: string,
    disableRoleSearch = false,
  ): Promise<User[]> {
    // the arguments of skip, take, orderBy can be undefined
    let query = this.createQueryBuilder('user')
      .innerJoinAndSelect('user.organization', 'organization')
      .innerJoinAndSelect('user.role', 'role')
      .where('organization.id = :organizationId', {
        organizationId,
      });

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
                  .innerJoin('user.organization', 'organization')
                  .innerJoin('user.role', 'role')
                  .where('role.slug LIKE :search', { search: `%${search}%` })
                  .getQuery();
                subQb.where('user.id IN ' + userIdsWithRoles);
              }),
            );
          }
        }),
      );
    }

    if (options) {
      query = query.skip(options?.offset).take(options?.limit);
    }

    return await query.getMany();
  }

  async findByUserIdWithUserOrgRole(
    organizationId: number,
    userId: number,
  ): Promise<User> {
    const query = this.createQueryBuilder('user')
      .innerJoinAndSelect('user.organization', 'organization')
      .innerJoinAndSelect('user.role', 'role')
      .where('organization.id = :organizationId', {
        organizationId,
      })
      .andWhere('user.id = :userId', { userId });

    return await query.getOne();
  }

  async countUserInOrganization(
    organizationId: number,
    search?: string,
  ): Promise<number> {
    let query = this.createQueryBuilder('user')
      .leftJoinAndSelect('user.organization', 'organization')
      .leftJoinAndSelect('user.role', 'role')
      .where('organization.id = :organizationId', {
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
        'user.organization',
        'organization',
        'organization.id = :organizationId',
      )
      .leftJoin('user.role', 'role')
      .where('role.id = :adminId');
    return query
      .setParameters({ organizationId, adminId: Role.ADMIN_ROLE_ID })
      .getMany();
  }

  async findOrganizationFirstAdmin(organizationId: number): Promise<User> {
    const query = this.createQueryBuilder('user')
      .leftJoinAndSelect('user.organization', 'organization')
      .leftJoin('user.role', 'role')
      .where('organization.id = :organizationId')
      .andWhere('role.id = :adminId')
      .orderBy('user.createdAt', 'ASC');
    return query
      .setParameters({ organizationId, adminId: Role.ADMIN_ROLE_ID })
      .getOne();
  }
}
