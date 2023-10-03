import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { OrganizationUserResponseDto } from '../../../common/dto/organization-user-response.dto';

class MetaData {
  @ApiProperty({
    type: Number,
    oneOf: [{ type: 'number' }, { type: 'null' }],
  })
  prevPage: number | null;

  @ApiProperty({
    type: Number,
    oneOf: [{ type: 'number' }, { type: 'null' }],
  })
  nextPage: number | null;
}

export class OrganizationUserListResponseDto {
  @ApiResponseProperty({
    type: [OrganizationUserResponseDto],
  })
  users: OrganizationUserResponseDto[];

  @ApiResponseProperty({
    type: MetaData,
  })
  metadata: MetaData;
}
