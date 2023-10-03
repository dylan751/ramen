import { ApiResponseProperty } from '@nestjs/swagger';
import { Role } from 'src/db/entities';

export class UserRole {
  constructor(role: Role) {
    this.id = role.id;
    this.name = role.name;
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
}
