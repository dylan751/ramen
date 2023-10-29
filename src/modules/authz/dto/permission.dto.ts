import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { PermissionAction, PermissionSubject } from 'src/db/entities';

export class CaslPermission {
  @ApiResponseProperty({
    enum: PermissionAction,
  })
  @ApiProperty({ enumName: 'PermissionAction' })
  action: PermissionAction;

  @ApiResponseProperty({
    enum: PermissionSubject,
  })
  @ApiProperty({ enumName: 'PermissionSubject' })
  subject: PermissionSubject;
}
