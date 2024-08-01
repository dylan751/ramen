import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Category, ColorType, IconType, InvoiceType } from 'src/db/entities';
import { CategorySearchRequestDto } from './category-search-request.dto';

export class CategoryResponseDto {
  constructor(category: Category) {
    this.id = category.id;
    this.name = category.name;
    this.color = category.color;
    this.icon = category.icon;
    this.type = category.type;
    if (category.invoices) {
      this.totalSpent =
        category.invoices.reduce((acc, invoice) => {
          let sum = acc;
          sum += parseFloat((invoice.total / invoice.exchangeRate).toFixed(2));
          return sum;
        }, 0) ?? 0;
    }
    this.createdAt = category.createdAt;
  }

  @ApiResponseProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiResponseProperty({
    type: String,
    example: 'Computer Expense',
  })
  name: string;

  @ApiResponseProperty({
    enum: ColorType,
    example: ColorType.PRIMARY,
  })
  @ApiProperty({ enumName: 'ColorType' })
  color: ColorType;

  @ApiResponseProperty({
    enum: IconType,
    example: IconType.MDI_AIRPLANE,
  })
  @ApiProperty({ enumName: 'IconType' })
  icon: IconType;

  @ApiResponseProperty({
    enum: InvoiceType,
    example: InvoiceType.EXPENSE,
  })
  @ApiProperty({ enumName: 'InvoiceType' })
  type: InvoiceType;

  @ApiResponseProperty({
    type: Number,
    example: 1000,
  })
  totalSpent: number;

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
    type: CategorySearchRequestDto,
  })
  params: CategorySearchRequestDto;
}

export class CategoryResponseListDto {
  @ApiResponseProperty({
    type: [CategoryResponseDto],
  })
  categories: CategoryResponseDto[];

  @ApiResponseProperty({
    type: MetaData,
  })
  metadata: MetaData;
}
