import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { PermissionConfigDto } from './permission-config.dto';

export class CreateRoleRequestDto {
  @ApiProperty({
    type: String,
    example: 'Developer',
    required: true,
  })
  @MaxLength(24)
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    type: String,
    example: 'developer',
    required: true,
  })
  @MaxLength(24)
  @IsNotEmpty()
  readonly slug: string;

  @ApiProperty({
    type: [PermissionConfigDto],
    required: true,
  })
  @IsNotEmpty()
  @Type(() => PermissionConfigDto)
  @ValidateNested({ each: true })
  readonly permissionConfigs: PermissionConfigDto[];
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
