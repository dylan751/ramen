import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleRequestDto } from './create-role-request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, MaxLength } from 'class-validator';

export class UpdateRoleRequestDto extends PartialType(CreateRoleRequestDto) {
  @ApiProperty({
    type: String,
    example: 'Admin',
    required: false,
  })
  @MaxLength(24)
  @IsOptional()
  readonly name?: string;

  @ApiProperty({
    type: String,
    example: 'admin',
    required: false,
  })
  @MaxLength(24)
  @IsOptional()
  readonly slug?: string;
}
