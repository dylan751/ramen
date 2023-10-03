import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ArrayMaxSize, ArrayNotEmpty, IsArray, IsEmail } from 'class-validator';

export class BulkInviteRequestDto {
  @ApiProperty({
    type: [String],
    example: ['hoge@i.moneyforward.com', 'fuga@i.moneyforward.com'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(100)
  @IsEmail({}, { each: true })
  emails: string[];

  @ApiProperty({
    type: [Number],
    example: [2, 3],
    required: true,
  })
  @Transform(
    ({ value: roleIds }) =>
      Array.isArray(roleIds)
        ? roleIds.map((roleId: string) => Number(roleId))
        : roleIds,
    {
      toClassOnly: true,
    },
  )
  roleIds: Array<number>;
}
