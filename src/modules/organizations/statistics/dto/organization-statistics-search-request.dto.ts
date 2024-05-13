import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class OrganizationStatisticsSearchRequestDto {
  @ApiProperty({ required: false })
  @IsOptional()
  date?: Date;
}
