import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { PermissionAction, PermissionObject } from 'src/db/entities';

export class PermissionConfigDto {
  @ApiProperty({
    enum: PermissionAction,
    example: PermissionAction.CREATE,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(PermissionAction)
  readonly action: PermissionAction;

  @ApiProperty({
    enum: PermissionObject,
    example: PermissionObject.ORGANIZATION,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(PermissionObject)
  readonly object: PermissionObject;
}
