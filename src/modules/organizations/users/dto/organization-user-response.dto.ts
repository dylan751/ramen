import { ApiResponseProperty } from '@nestjs/swagger';
import { User } from 'src/db/entities';
import { OrganizationResponseDto } from 'src/modules/organizations/dto/organization-response.dto';
import { RoleResponseDto } from 'src/modules/organizations/roles/dto/role-response.dto';

export class OrganizationUserResponseDto {
  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
    this.organization = user.organization;
    this.createdAt = user.createdAt;
  }

  @ApiResponseProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiResponseProperty({
    type: String,
    example: 'John Doe',
  })
  name: string;

  @ApiResponseProperty({
    type: String,
    example: 'foo@gmail.com',
  })
  email: string;

  @ApiResponseProperty({
    type: RoleResponseDto,
  })
  role: RoleResponseDto;

  @ApiResponseProperty({
    type: OrganizationResponseDto,
  })
  organization: OrganizationResponseDto;

  @ApiResponseProperty({
    type: Date,
    example: '2020/01/01 15:00:00',
  })
  createdAt: Date;
}

export class UserResponseListDto {
  constructor(users: User[]) {
    this.items = users.map((user) => new OrganizationUserResponseDto(user));
  }

  @ApiResponseProperty({
    type: [OrganizationUserResponseDto],
  })
  items: OrganizationUserResponseDto[];
}
