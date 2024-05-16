import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Budget } from 'src/db/entities';
import { BudgetSearchRequestDto } from './budget-search-request.dto';
import { CategoryResponseDto } from '../../categories/dto/category-response.dto';

export class BudgetResponseDto {
  constructor(budget: Budget) {
    this.id = budget.id;
    this.categoryId = budget.categoryId;
    this.amount = budget.amount;
    if (budget.category) {
      this.category = new CategoryResponseDto(budget.category);
    }
    this.createdAt = budget.createdAt;
  }

  @ApiResponseProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiResponseProperty({
    type: Number,
    example: 1,
  })
  categoryId: number;

  @ApiResponseProperty({
    type: Number,
    example: 100000,
  })
  amount: number;

  @ApiResponseProperty({
    type: CategoryResponseDto,
  })
  category: CategoryResponseDto;

  @ApiResponseProperty({
    type: Date,
    example: '2024-02-26T07:31:35.000Z',
  })
  createdAt: Date;
}

class MetaData {
  @ApiProperty({
    type: Number,
  })
  total: number;

  @ApiProperty({
    type: BudgetSearchRequestDto,
  })
  params: BudgetSearchRequestDto;
}

export class BudgetResponseListDto {
  @ApiResponseProperty({
    type: [BudgetResponseDto],
  })
  budgets: BudgetResponseDto[];

  @ApiResponseProperty({
    type: MetaData,
  })
  metadata: MetaData;
}
