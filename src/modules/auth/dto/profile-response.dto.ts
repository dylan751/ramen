import { ApiResponseProperty } from '@nestjs/swagger';
import { User } from 'src/db/entities';
import { OrganizationResponseDto } from 'src/modules/organizations/dto/organization-response.dto';

export class ProfileResponseDto {
  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.organization = user.organization;
  }

  @ApiResponseProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiResponseProperty({
    type: String,
    example: 'foo',
  })
  name: string;

  @ApiResponseProperty({
    type: String,
    example: 'foo@gmail.com',
  })
  email: string;

  @ApiResponseProperty({
    type: OrganizationResponseDto,
    example: {
      id: 1,
      name: 'First Organization Name',
      uniqueName: 'first_organization_unique_name',
    },
  })
  organization: OrganizationResponseDto;
}
