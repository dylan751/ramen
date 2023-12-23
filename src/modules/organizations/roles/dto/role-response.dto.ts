import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Permission, Role } from 'src/db/entities';
import { RoleSearchRequestDto } from './role-search-request.dto';

export class RoleResponseDto {
  constructor(role: Role) {
    this.id = role.id;
    this.name = role.name;
    this.slug = role.slug;
    this.permissions = role.rolePermissions.map(
      (rolePermission) => rolePermission.permission,
    );
    this.isCustom = role.organizationId !== 0;
    this.createdAt = role.createdAt;
  }

  @ApiResponseProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiResponseProperty({
    type: String,
    example: 'Admin',
  })
  name: string;

  @ApiResponseProperty({
    type: String,
    example: 'admin',
  })
  slug: string;

  @ApiResponseProperty({
    type: [Permission],
  })
  permissions: Permission[];

  @ApiResponseProperty({
    type: Boolean,
  })
  isCustom: boolean;

  @ApiResponseProperty({
    type: Date,
    example: '2020/01/01 15:00:00',
  })
  createdAt: Date;
}

class MetaData {
  @ApiProperty({
    type: Number,
  })
  total: number;

  @ApiProperty({
    type: RoleSearchRequestDto,
  })
  params: RoleSearchRequestDto;
}

export class RoleResponseListDto {
  @ApiResponseProperty({
    type: [RoleResponseDto],
  })
  roles: RoleResponseDto[];

  @ApiResponseProperty({
    type: MetaData,
  })
  metadata: MetaData;
}
