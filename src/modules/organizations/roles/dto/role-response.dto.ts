import { ApiResponseProperty } from '@nestjs/swagger';
import { Role } from 'src/db/entities';

export class RoleResponseDto {
  constructor(role: Role) {
    this.id = role.id;
    this.name = role.name;
    this.slug = role.slug;
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
    type: Date,
    example: '2020/01/01 15:00:00',
  })
  createdAt: Date;
}

export class RoleResponseListDto {
  constructor(roles: Role[]) {
    this.roles = roles.map((role) => new RoleResponseDto(role));
  }

  @ApiResponseProperty({
    type: [RoleResponseDto],
  })
  roles: RoleResponseDto[];
}
