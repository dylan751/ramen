import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Invoice, InvoiceType } from 'src/db/entities';
import { InvoiceSearchRequestDto } from './invoice-search-request.dto';

export class InvoiceResponseDto {
  constructor(invoice: Invoice) {
    this.id = invoice.id;
    this.name = invoice.name;
    this.note = invoice.note || null;
    this.amount = invoice.amount;
    this.date = invoice.date;
    this.type = invoice.type;
    this.createdAt = invoice.createdAt;
  }

  @ApiResponseProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiResponseProperty({
    type: String,
    example: 'Monthly bill',
  })
  name: string;

  @ApiResponseProperty({
    type: String,
    example: 'Pay monthly internet bill',
  })
  note: string;

  @ApiResponseProperty({
    type: Number,
    example: 10000,
  })
  amount: number;

  @ApiResponseProperty({
    type: Date,
    example: '2024/02/15',
  })
  date: Date;

  @ApiResponseProperty({
    enum: InvoiceType,
  })
  @ApiProperty({ enumName: 'InvoiceType' })
  type: InvoiceType;

  @ApiResponseProperty({
    type: Date,
    example: '2020/01/01 15:00:00',
  })
  createdAt: Date;
}

class MetaData {
  @ApiProperty({
    type: Number,
  })
  total: number;

  @ApiProperty({
    type: InvoiceSearchRequestDto,
  })
  params: InvoiceSearchRequestDto;
}

export class InvoiceResponseListDto {
  @ApiResponseProperty({
    type: [InvoiceResponseDto],
  })
  invoices: InvoiceResponseDto[];

  @ApiResponseProperty({
    type: MetaData,
  })
  metadata: MetaData;
}
