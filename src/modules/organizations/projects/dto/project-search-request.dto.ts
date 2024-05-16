import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ProjectSearchRequestDto {
  @ApiProperty({ required: false })
  @IsOptional()
  query?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  fromDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  toDate?: Date;
}
