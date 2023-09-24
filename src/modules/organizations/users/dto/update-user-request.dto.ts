import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsOptional, Matches, MinLength } from 'class-validator';

const passwordRegEx =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,20}$/;

export class UpdateUserRequestDto {
  @ApiProperty({
    type: String,
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @MinLength(2)
  readonly name?: string;

  @ApiProperty({
    type: String,
    example: 'foo@gmail.cm',
    required: true,
  })
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @ApiProperty({
    type: String,
    example: 'password',
    required: true,
  })
  @IsOptional()
  @Matches(passwordRegEx, {
    message: `Password must contain Minimum 8 and maximum 20 characters, 
      at least one uppercase letter, 
      one lowercase letter, 
      one number and 
      one special character`,
  })
  readonly password?: string;
}
