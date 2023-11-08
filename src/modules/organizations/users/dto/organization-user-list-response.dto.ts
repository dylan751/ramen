import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { OrganizationUserResponseDto } from '../../../common/dto/organization-user-response.dto';
import { UserSearchRequestDto } from './user-search-request.dto';

class MetaData {
  @ApiProperty({
    type: Number,
  })
  total: number;

  @ApiProperty({
    type: UserSearchRequestDto,
  })
  params: UserSearchRequestDto;

  @ApiResponseProperty({
    type: [OrganizationUserResponseDto],
  })
  allData: OrganizationUserResponseDto[];
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
