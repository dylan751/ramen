import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RegisterResponse {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'foo@gmail.com',
  })
  public readonly email: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'foo',
  })
  public readonly name: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'password',
  })
  public readonly password: string;
}
