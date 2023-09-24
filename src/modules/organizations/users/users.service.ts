import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from 'src/db/repositories';
import { ProfileResponseDto } from '../../auth/dto/profile-response.dto';
import { OrganizationUserListResponseDto } from './dto/organization-user-list-response.dto';
import { OrganizationUserResponseDto } from './dto/organization-user-response.dto';
import { UpdateOrganizationUserRequestDto } from './dto/update-organization-user-request.dto';
import { RoleRepository } from 'src/db/repositories/role.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
  ) {}
  async findByOrganization(
    organizationId: number,
  ): Promise<OrganizationUserListResponseDto> {
    const users = await this.userRepository.findByOrganizationWithUserOrgRole(
      organizationId,
    );

    const userDtos = users.map((user) => new OrganizationUserResponseDto(user));

    const result = new OrganizationUserListResponseDto();
    result.users = userDtos;
    return result;
  }

  async update(
    organizationId: number,
    userId: number,
    request: UpdateOrganizationUserRequestDto,
  ): Promise<OrganizationUserResponseDto> {
    const userOrganization = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!userOrganization) {
      throw new NotFoundException(
        `user ${userId} does not belong to the organization ${organizationId}`,
      );
    }

    const roleId = request.roleId;
    await this.checkRole(organizationId, roleId);

    await this.userRepository.save({ id: userId, roleId });

    const updatedUserOrganization =
      await this.userRepository.findByIdWithOrganizationsAndRoles(userId);

    return new OrganizationUserResponseDto(updatedUserOrganization);
  }

  // createUser(createUserRequestDto: CreateUserRequestDto): Promise<User> {
  //   const user: User = new User();
  //   user.name = createUserRequestDto.name;
  //   user.email = createUserRequestDto.email;
  //   user.password = createUserRequestDto.password;
  //   return this.userRepository.save(user);
  // }

  // updateUser(
  //   id: number,
  //   updateUserRequestDto: UpdateUserRequestDto,
  // ): Promise<User> {
  //   const user: User = new User();
  //   user.name = updateUserRequestDto.name;
  //   user.email = updateUserRequestDto.email;
  //   user.password = updateUserRequestDto.password;
  //   user.id = id;
  //   return this.userRepository.save(user);
  // }

  // removeUser(id: number): Promise<{ affected?: number }> {
  //   return this.userRepository.delete(id);
  // }

  async findByIdWithOrganizationsAndRoles(
    id: number,
  ): Promise<ProfileResponseDto> {
    const user = await this.userRepository.findByIdWithOrganizationsAndRoles(
      id,
    );
    const profile = new ProfileResponseDto(user);

    return profile;
  }

  async checkRole(organizationId: number, roleId: number): Promise<void> {
    const role = await this.roleRepository.findOne({ where: { id: roleId } });

    if (!role.belongsToOrg(organizationId)) {
      throw new NotFoundException(
        `Role ${role.id} does not belong to organization ${organizationId}`,
      );
    }

    if (!role) {
      throw new NotFoundException(`Role do not exist ${role.id}`);
    }
  }
}
