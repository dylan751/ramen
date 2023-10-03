import { ApiResponseProperty } from '@nestjs/swagger';

export class BulkInviteResponseDto {
  @ApiResponseProperty({
    type: Number,
    example: 1,
  })
  invitedCount: number;

  @ApiResponseProperty({
    type: Number,
    example: 1,
  })
  notInvitedCount: number;
}
