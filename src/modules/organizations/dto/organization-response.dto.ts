import { ApiResponseProperty } from '@nestjs/swagger';
import { Organization } from 'src/db/entities';
import { RoleResponseDto } from 'src/modules/role/dto/role-response.dto';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';

export class OrganizationResponseDto {
  constructor(organization: Organization) {
    this.id = organization.id;
    this.name = organization.name;
    this.uniqueName = organization.uniqueName;
    this.users = organization.users;
    this.roles = organization.roles;
    this.createdAt = organization.createdAt;
  }

  @ApiResponseProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiResponseProperty({
    type: String,
    example: 'Test org',
  })
  name: string;

  @ApiResponseProperty({
    type: String,
    example: 'test-org',
  })
  uniqueName: string;

  @ApiResponseProperty({
    type: [UserResponseDto],
  })
  users: UserResponseDto[];

  @ApiResponseProperty({
    type: [RoleResponseDto],
  })
  roles: RoleResponseDto[];

  @ApiResponseProperty({
    type: Date,
    example: '2020/01/01 15:00:00',
  })
  createdAt: Date;
}

export class OrganizationResponseListDto {
  constructor(organizations: Organization[]) {
    this.items = organizations.map(
      (organization) => new OrganizationResponseDto(organization),
    );
  }

  @ApiResponseProperty({
    type: [OrganizationResponseDto],
  })
  items: OrganizationResponseDto[];
}
