import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Role, UserOrganizationRole } from 'src/db/entities';

@Injectable()
export class UserOrganizationRoleRepository extends Repository<UserOrganizationRole> {
  constructor(private dataSource: DataSource) {
    super(UserOrganizationRole, dataSource.createEntityManager());
  }

  async countAdmin(organizationId: number): Promise<number> {
    return await this.createQueryBuilder('userOrganizationRoles')
      .innerJoinAndSelect('userOrganizationRoles.role', 'role')
      .innerJoinAndSelect(
        'userOrganizationRoles.userOrganization',
        'userOrganization',
      )
      .innerJoinAndSelect('userOrganization.organization', 'organization')
      .where('organization.id = :organizationId', { organizationId })
      .andWhere('role.id = :roleId', { roleId: Role.ADMIN_ROLE_ID })
      .getCount();
  }
}
