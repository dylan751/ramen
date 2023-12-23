import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class RoleSearchRequestDto {
  @ApiProperty({ required: false })
  @IsOptional()
  query: string;
}
