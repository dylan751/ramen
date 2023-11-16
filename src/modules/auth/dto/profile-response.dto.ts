import { ApiResponseProperty } from '@nestjs/swagger';
import { User } from 'src/db/entities';
import { OrganizationProfileResponseDto } from 'src/modules/organizations/users/dto/organization-profile-response.dto';

export class ProfileResponseDto {
  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.phone = user.phone;
    this.address = user.address;
    this.avatar = user.avatar;
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
    type: String,
    example: '0339089172',
  })
  phone: string;

  @ApiResponseProperty({
    type: String,
    example: '19A Bach Khoa, Ha Noi',
  })
  address: string;

  @ApiResponseProperty({
    type: String,
    example: 'https://image.com/avatar-1',
  })
  avatar: string;

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
