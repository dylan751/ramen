import { ApiResponseProperty } from '@nestjs/swagger';
import { User } from 'src/db/entities';
import { OrganizationProfileResponseDto } from 'src/modules/organizations/users/dto/organization-profile-response.dto';

export class ProfileResponseDto {
  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.organizations = user.userOrganizations.map(
      (userOrganization) =>
        new OrganizationProfileResponseDto(
          userOrganization.organization,
          userOrganization.roles,
        ),
    );
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
    type: [OrganizationProfileResponseDto],
    example: [
      {
        id: 1,
        name: 'First Organization Name',
        uniqueName: 'first_organization_unique_name',
        roles: [
          {
            id: 1,
            name: 'Admin',
          },
        ],
      },
    ],
  })
  organizations: OrganizationProfileResponseDto[];
}
