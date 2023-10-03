import { ApiResponseProperty } from '@nestjs/swagger';

export class TotalAdminResponseDto {
  @ApiResponseProperty({
    type: Number,
    example: 5,
  })
  totalAdmins: number;
}
