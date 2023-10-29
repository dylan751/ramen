import { ApiResponseProperty } from '@nestjs/swagger';
import { CaslPermission } from 'src/modules/authz/dto/permission.dto';

export class GetUserPermissionsResponseDto {
  @ApiResponseProperty({
    type: [CaslPermission],
  })
  permissions: CaslPermission[];
}
