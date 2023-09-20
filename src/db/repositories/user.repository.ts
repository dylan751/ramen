import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, Repository } from 'typeorm';
import { Role, User } from 'src/db/entities';

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

  async countUserInOrganization(
    organizationId: number,
    search?: string,
  ): Promise<number> {
    let query = this.createQueryBuilder('user')
      .leftJoinAndSelect('user.organization', 'organization')
      .leftJoinAndSelect('user.role', 'role')
      .where('organization.organizationId = :organizationId', {
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

  async findActiveAdmin(organizationId: number): Promise<User[]> {
    const query = this.createQueryBuilder('user')
      .leftJoinAndSelect(
        'user.organization',
        'organization',
        'organization.organizationId = :organizationId',
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
      .where('organization.organizationId = :organizationId')
      .andWhere('role.id = :adminId')
      .orderBy('userOrganization.createdAt', 'ASC');
    return query
      .setParameters({ organizationId, adminId: Role.ADMIN_ROLE_ID })
      .getOne();
  }
}
