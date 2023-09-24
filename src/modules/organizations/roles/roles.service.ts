import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleRequestDto } from './dto/create-role-request.dto';
import { UpdateRoleRequestDto } from './dto/update-role-request.dto';
import { RoleRepository } from 'src/db/repositories/role.repository';
import { Role } from 'src/db/entities';

@Injectable()
export class RolesService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async create(
    organizationId: number,
    request: CreateRoleRequestDto,
  ): Promise<Role> {
    const { name, slug } = request;
    const role = new Role();
    role.name = name;
    role.slug = slug;
    role.organizationId = organizationId;

    // Check if role already exists
    const isRoleExisted = await this.roleRepository.findBySlug(request.slug);
    if (isRoleExisted) {
      throw new BadRequestException('An role with that slug already exists!');
    }

    const createdRole = await this.roleRepository.save(role);

    return createdRole;
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

  async update(id: number, updateRoleRequestDto: UpdateRoleRequestDto) {
    return `This action updates a #${id} role`;
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
      await manager.delete(Role, { id: roleId });
    });
  }
}
