import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';

export class CreateBudgetRequestDto {
  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  readonly categoryId: number;

  @ApiProperty({
    type: Number,
    example: 100000,
    required: true,
  })
  @IsNotEmpty()
  readonly amount: number;
}

export class CreateBudgetsRequestDto {
  @ApiProperty({
    type: [CreateBudgetRequestDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBudgetRequestDto)
  readonly budgets: CreateBudgetRequestDto[];
}
