import { ApiResponseProperty } from '@nestjs/swagger';

export class IncomesAndExpensesByCategoryResponseDto {
  @ApiResponseProperty({
    type: String,
    example: 'Computer Expense',
  })
  name: string;

  @ApiResponseProperty({
    type: String,
    example: 'success',
  })
  color: string;

  @ApiResponseProperty({
    type: Number,
    example: 1000,
  })
  total: number; // Calc by USD
}

export class ProjectStatisticsResponseDto {
  @ApiResponseProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiResponseProperty({
    type: String,
    example: 'HPTN083',
  })
  name: string;

  @ApiResponseProperty({
    type: Date,
    example: '2024-02-26T07:31:35.000Z',
  })
  created: Date;

  @ApiResponseProperty({
    type: Number,
    example: 10,
  })
  invoiceCount: number;

  @ApiResponseProperty({
    type: Number,
    example: 10,
  })
  budgetCount: number;

  @ApiResponseProperty({
    type: Number,
    example: 10,
  })
  categoryCount: number;

  @ApiResponseProperty({
    type: Number,
    example: 10000,
  })
  totalIncome: number;

  @ApiResponseProperty({
    type: Number,
    example: 10000,
  })
  totalExpense: number;

  @ApiResponseProperty({
    type: Number,
    example: 10000,
  })
  balance: number;

  @ApiResponseProperty({
    type: [Number],
    example: [100, 300, 320, 150, 170, 150, 150, 300, 230, 170, 260, 200],
  })
  incomesByMonth: number[];

  @ApiResponseProperty({
    type: [Number],
    example: [280, 200, 220, 180, 270, 250, 70, 90, 200, 150, 160, 100],
  })
  expensesByMonth: number[];

  @ApiResponseProperty({
    type: [IncomesAndExpensesByCategoryResponseDto],
  })
  expensesByCategory: IncomesAndExpensesByCategoryResponseDto[];

  @ApiResponseProperty({
    type: [IncomesAndExpensesByCategoryResponseDto],
  })
  incomesByCategory: IncomesAndExpensesByCategoryResponseDto[];
}
