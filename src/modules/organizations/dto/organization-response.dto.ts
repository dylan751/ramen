import { ApiResponseProperty } from '@nestjs/swagger';
import { Organization } from 'src/db/entities';

export class OrganizationResponseDto {
  constructor(organization: Organization) {
    this.id = organization.id;
    this.name = organization.name;
    this.uniqueName = organization.uniqueName;
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
