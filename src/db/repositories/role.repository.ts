import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Role } from 'src/db/entities';
import { RoleSearchRequestDto } from 'src/modules/organizations/roles/dto/role-search-request.dto';

@Injectable()
export class RoleRepository extends Repository<Role> {
  constructor(private dataSource: DataSource) {
    super(Role, dataSource.createEntityManager());
  }

  async findBySlug(slug: string): Promise<Role> {
    return await this.findOne({ where: { slug: slug } });
  }

  async findByUserIdAndOrganizationId(
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
      .orWhere('organizationId = 0') // standard roles: Admin, Member, ...
      .getMany();
  }

  async findRolesWithPermissionsForOrganization(
    organizationId: number,
    search: RoleSearchRequestDto,
  ): Promise<Role[]> {
    const allRoles = await this.createQueryBuilder('role')
      .leftJoinAndSelect('role.rolePermissions', 'rolePermissions')
      .leftJoinAndSelect('rolePermissions.permission', 'permission')
      .where('organizationId = :organizationId', { organizationId }) // custom roles
      .orWhere('organizationId = 0') // standard roles: Admin, Member, ...
      .getMany();

    let filteredRoles = allRoles;
    if (search.query) {
      const queryLowered = search.query.toLowerCase();
      filteredRoles = allRoles.filter((role) =>
        role.name.toLowerCase().includes(queryLowered),
      );
    }

    return filteredRoles;
  }

  async findRoleForOrganization(
    organizationId: number,
    id: number,
  ): Promise<Role> {
    return await this.createQueryBuilder('role')
      .where('organizationId = :organizationId', { organizationId })
      .andWhere('id = :id', { id })
      .getOne();
  }

  async findCustomRolesForOrganization(
    organizationId: number,
  ): Promise<Role[]> {
    return await this.createQueryBuilder('role')
      .where('organizationId = :organizationId', { organizationId }) // custom roles
      .getMany();
  }

  async countOrgRoles(organizationId: number): Promise<number> {
    return this.count({
      where: {
        organizationId,
      },
    });
  }
}
