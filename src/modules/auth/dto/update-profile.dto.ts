import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateProfileRequestDto {
  @ApiProperty({
    type: String,
    example: 'Foo',
    required: false,
  })
  @IsOptional()
  readonly name?: string;

  @ApiProperty({
    type: String,
    example: '0339089172',
    required: false,
  })
  @IsOptional()
  readonly phone?: string;

  @ApiProperty({
    type: String,
    example: '19A Bach Khoa, Ha Noi',
    required: false,
  })
  @IsOptional()
  readonly address?: string;
}
