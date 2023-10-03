import { ApiResponseProperty } from '@nestjs/swagger';
import { Organization, Role } from 'src/db/entities';
import { UserRole } from 'src/modules/common/dto/user-role.dto';

export class OrganizationProfileResponseDto {
  constructor(organization: Organization, roles: Role[]) {
    this.id = organization.id;
    this.name = organization.name;
    this.uniqueName = organization.uniqueName;
    this.roles = roles.map((role) => new UserRole(role));
  }

  @ApiResponseProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiResponseProperty({
    type: String,
    example: 'Organization Fullname',
  })
  name: string;

  @ApiResponseProperty({
    type: String,
    example: 'org_unique_name',
  })
  uniqueName: string;

  @ApiResponseProperty({
    type: [UserRole],
  })
  roles: UserRole[];
}
