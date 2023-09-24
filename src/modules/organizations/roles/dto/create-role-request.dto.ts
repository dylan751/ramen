import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class CreateRoleRequestDto {
  @ApiProperty({
    type: String,
    example: 'Admin',
    required: true,
  })
  @MaxLength(24)
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    type: String,
    example: 'admin',
    required: true,
  })
  @MaxLength(24)
  @IsNotEmpty()
  readonly slug: string;
}

export class CreateRolesRequestDto {
  @ApiProperty({
    type: [CreateRoleRequestDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRoleRequestDto)
  readonly roles: CreateRoleRequestDto[];
}
