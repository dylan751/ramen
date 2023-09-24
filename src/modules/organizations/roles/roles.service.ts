import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleRequestDto } from './dto/create-role-request.dto';
import { UpdateRoleRequestDto } from './dto/update-role-request.dto';
import { RoleRepository } from 'src/db/repositories/role.repository';
import { Role } from 'src/db/entities';

@Injectable()
export class RolesService {
  constructor(private readonly roleRepository: RoleRepository) {}

  create(createRoleRequestDto: CreateRoleRequestDto) {
    return 'This action adds a new role';
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
        `role ${roleId} does not belong to the organization ${organizationId}`,
      );
    }

    return role;
  }

  update(id: number, updateRoleRequestDto: UpdateRoleRequestDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
