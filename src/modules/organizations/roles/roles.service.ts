import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleRequestDto } from './dto/create-role-request.dto';
import { UpdateRoleRequestDto } from './dto/update-role-request.dto';
import { RoleRepository } from 'src/db/repositories/role.repository';
import { Role, RolePermission } from 'src/db/entities';
import { PermissionRepository } from 'src/db/repositories/permission.repository';

@Injectable()
export class RolesService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly permissionRepository: PermissionRepository,
  ) {}

  async create(
    organizationId: number,
    request: CreateRoleRequestDto,
  ): Promise<Role> {
    const { name, slug, permissionConfigs } = request;

    // Check if role already exists
    const isRoleExisted = await this.roleRepository.findBySlug(request.slug);
    if (isRoleExisted) {
      throw new BadRequestException('A role with that slug already exists!');
    }

    // Create role
    const role = new Role();
    role.name = name;
    role.slug = slug;
    role.organizationId = organizationId;

    // Find permission ids inside db
    const permissionIds = await Promise.all(
      permissionConfigs.map(async (permissionConfig) => {
        const permission =
          await this.permissionRepository.findByPermissionConfig(
            permissionConfig.action,
            permissionConfig.object,
          );
        return permission.id;
      }),
    );

    // Save ids into role_permissions table
    await this.roleRepository.manager.transaction(async (manager) => {
      await manager.save(Role, role);

      // Create role_permissions
      const rolesPermissions: RolePermission[] = [];

      permissionIds.forEach((permissionId) => {
        const rolePermission = new RolePermission();
        rolePermission.roleId = role.id;
        rolePermission.permissionId = permissionId;
        rolesPermissions.push(rolePermission);
      });
      await manager.save(RolePermission, rolesPermissions);
      role.rolePermissions = rolesPermissions;
    });

    return role;
  }

  async findAll(organizationId: number): Promise<Role[]> {
    const roles = await this.roleRepository.findRolesForOrganization(
      organizationId,
    );

    return roles;
  }

  async findOne(organizationId: number, roleId: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { organizationId, id: roleId },
    });
    if (!role) {
      throw new NotFoundException(
        `Role ${roleId} does not belong to the organization ${organizationId}`,
      );
    }

    return role;
  }

  async update(
    organizationId: number,
    roleId: number,
    req: UpdateRoleRequestDto,
  ) {
    const { name, slug, permissionConfigs } = req;
    const role = await this.roleRepository.findOneOrFail({
      where: { id: roleId, organizationId },
    });

    if (name) role.name = name;
    if (slug) role.slug = slug;

    if (permissionConfigs) {
      // Find permission ids inside db
      const permissionIds = await Promise.all(
        permissionConfigs.map(async (permissionConfig) => {
          const permission =
            await this.permissionRepository.findByPermissionConfig(
              permissionConfig.action,
              permissionConfig.object,
            );
          return permission.id;
        }),
      );

      await this.roleRepository.manager.transaction(async (manager) => {
        // Delete previous ids inside role_permissions table
        await manager.delete(RolePermission, { roleId });

        // Save ids into role_permissions table
        const rolesPermissions: RolePermission[] = [];

        permissionIds.forEach((permissionId) => {
          const rolePermission = new RolePermission();
          rolePermission.roleId = role.id;
          rolePermission.permissionId = permissionId;
          rolesPermissions.push(rolePermission);
        });
        await manager.save(RolePermission, rolesPermissions);
        role.rolePermissions = rolesPermissions;
      });
    }

    return await role.save();
  }

  async delete(organizationId: number, roleId: number): Promise<void> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId, organizationId },
    });

    if (!role) {
      throw new NotFoundException(
        `Role ${roleId} doesn't belong to organization ${organizationId}`,
      );
    }

    await this.roleRepository.manager.transaction(async (manager) => {
      await manager.delete(RolePermission, { roleId });
      await manager.delete(Role, { id: roleId });
    });
  }
}
