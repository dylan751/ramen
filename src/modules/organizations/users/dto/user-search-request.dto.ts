import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UserSearchRequestDto {
  @ApiProperty({ required: false })
  @IsOptional()
  query: string;

  @ApiProperty({ required: false })
  @IsOptional()
  role: string;
}
