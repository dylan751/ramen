import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class LoginWithGoogleRequestDto {
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

  @ApiProperty({
    type: String,
    example: 'https://avatar.png',
  })
  @IsOptional()
  public readonly avatar?: string;
}
