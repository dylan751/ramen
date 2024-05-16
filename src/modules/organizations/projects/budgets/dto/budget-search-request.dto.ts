import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class BudgetSearchRequestDto {
  @ApiProperty({ required: false })
  @IsOptional()
  categoryId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  fromAmount?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  toAmount?: number;
}
