import { Injectable } from '@nestjs/common';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { User } from '../../../db/entities/user.entity';
import { UserRepository } from 'src/db/repositories';
import { ProfileResponseDto } from '../../auth/dto/profile-response.dto';
import { OrganizationUserListResponseDto } from './dto/organization-user-list-response.dto';
import { OrganizationUserResponseDto } from './dto/organization-user-response.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}
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

  createUser(createUserRequestDto: CreateUserRequestDto): Promise<User> {
    const user: User = new User();
    user.name = createUserRequestDto.name;
    user.email = createUserRequestDto.email;
    user.password = createUserRequestDto.password;
    return this.userRepository.save(user);
  }

  findAllUser(): Promise<User[]> {
    return this.userRepository.find();
  }

  findUser(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  updateUser(
    id: number,
    updateUserRequestDto: UpdateUserRequestDto,
  ): Promise<User> {
    const user: User = new User();
    user.name = updateUserRequestDto.name;
    user.email = updateUserRequestDto.email;
    user.password = updateUserRequestDto.password;
    user.id = id;
    return this.userRepository.save(user);
  }

  removeUser(id: number): Promise<{ affected?: number }> {
    return this.userRepository.delete(id);
  }

  async findByIdWithOrganizationsAndRoles(
    id: number,
  ): Promise<ProfileResponseDto> {
    const user = await this.userRepository.findByIdWithOrganizationsAndRoles(
      id,
    );
    const profile = new ProfileResponseDto(user);

    return profile;
  }
}
