import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ProjectStatisticsSearchRequestDto {
  @ApiProperty({ required: false })
  @IsOptional()
  date?: Date;
}
