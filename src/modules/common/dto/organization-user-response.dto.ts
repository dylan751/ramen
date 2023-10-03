import { ApiResponseProperty } from '@nestjs/swagger';
import { User, UserOrganization } from 'src/db/entities';
import { UserRole } from './user-role.dto';

export class OrganizationUserResponseDto {
  constructor(user: User, userOrg: UserOrganization) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.roles = userOrg.roles.map((role) => new UserRole(role));
  }

  @ApiResponseProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiResponseProperty({
    type: String,
    example: 'robin@moneyforward.co.jp',
  })
  email: string;

  @ApiResponseProperty({
    type: String,
    example: 'robin',
  })
  name: string;

  @ApiResponseProperty({
    type: [UserRole],
  })
  roles: UserRole[];
}
