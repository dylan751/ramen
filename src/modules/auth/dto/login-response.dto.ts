import { ApiProperty } from '@nestjs/swagger';
import { ProfileResponseDto } from './profile-response.dto';

export class LoginResponse {
  @ApiProperty({
    type: String,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  accessToken: string;

  @ApiProperty({
    type: ProfileResponseDto,
  })
  userData: ProfileResponseDto;
}
