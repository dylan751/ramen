import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiProperty({
    type: String,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  token: string;
}
