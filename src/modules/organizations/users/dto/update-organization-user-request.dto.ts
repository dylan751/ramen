import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrganizationUserRequestDto {
  @ApiProperty({
    type: Number,
    example: 2,
    required: true,
  })
  roleId: number;
}
