import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Category, InvoiceType } from 'src/db/entities';
import { CategorySearchRequestDto } from './category-search-request.dto';

export class CategoryResponseDto {
  constructor(category: Category) {
    this.id = category.id;
    this.name = category.name;
    this.color = category.color;
    this.icon = category.icon;
    this.type = category.type;
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
    type: String,
    example: '#abcdef',
  })
  color: string;

  @ApiResponseProperty({
    type: String,
    example: 'mdi:circle-outline',
  })
  icon: string;

  @ApiResponseProperty({
    enum: InvoiceType,
    example: InvoiceType.EXPENSE,
  })
  @ApiProperty({ enumName: 'InvoiceType' })
  type: InvoiceType;

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
