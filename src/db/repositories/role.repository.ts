import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Role } from 'src/db/entities';

@Injectable()
export class RoleRepository extends Repository<Role> {
  constructor(private dataSource: DataSource) {
    super(Role, dataSource.createEntityManager());
  }

  async findBySlug(slug: string): Promise<Role> {
    return await this.findOne({ where: { slug: slug } });
  }

  async findyByUserIdAndOrganizationId(
    userId: number,
    organizationId: number,
  ): Promise<Role[]> {
    return await this.createQueryBuilder('role')
      .innerJoin('role.userOrganizationRoles', 'userOrganizationRoles')
      .innerJoin('userOrganizationRoles.userOrganization', 'userOrganization')
      .innerJoin('userOrganization.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('userOrganizationRoles.organizationId = :organizationId', {
        organizationId,
      })
      .getMany();
  }

  async findRolesForOrganization(organizationId: number): Promise<Role[]> {
    return await this.createQueryBuilder('role')
      .where('organizationId = :organizationId', { organizationId }) // custom roles
      .getMany();
  }

  async findRoleForOrganization(
    organizationId: number,
    id: number,
  ): Promise<Role> {
    return await this.createQueryBuilder('role')
      .where('role.organizationId = :organizationId', { organizationId })
      .andWhere('id = :id', { id })
      .getOne();
  }
}
