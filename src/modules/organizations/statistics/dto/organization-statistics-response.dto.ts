import { ApiResponseProperty } from '@nestjs/swagger';
import { ProjectResponseDto } from '../../projects/dto/project-response.dto';

export class OrganizationStatisticsResponseDto {
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
  projectCount: number;

  @ApiResponseProperty({
    type: Number,
    example: 10,
  })
  invoiceCount: number;

  @ApiResponseProperty({
    type: Number,
    example: 10,
  })
  userCount: number;

  @ApiResponseProperty({
    type: Number,
    example: 10,
  })
  roleCount: number;

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
    type: [ProjectResponseDto],
  })
  projects: ProjectResponseDto[];

  @ApiResponseProperty({
    type: Number,
    example: 10000,
  })
  totalUncategorizedIncome: number;

  @ApiResponseProperty({
    type: Number,
    example: 10000,
  })
  totalUncategorizedExpense: number;
}
