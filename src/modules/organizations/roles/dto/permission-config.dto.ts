import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { PermissionAction, PermissionSubject } from 'src/db/entities';

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
    enum: PermissionSubject,
    example: PermissionSubject.ORGANIZATION,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(PermissionSubject)
  readonly subject: PermissionSubject;
}
