import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateBudgetRequestDto {
  @ApiProperty({
    type: Number,
    example: 100000,
    required: false,
  })
  @IsOptional()
  readonly amount?: number;
}
