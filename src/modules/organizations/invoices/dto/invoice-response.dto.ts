import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { CurrencyType, Invoice, InvoiceType } from 'src/db/entities';
import { InvoiceSearchRequestDto } from './invoice-search-request.dto';
import { OrganizationUserResponseDto } from 'src/modules/common/dto/organization-user-response.dto';
import { InvoiceItem } from 'src/db/entities/invoice-item.entity';

class InvoiceItemResponseDto {
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
  price: number;

  @ApiResponseProperty({
    type: Number,
    example: 1,
  })
  quantity: number;

  @ApiResponseProperty({
    enum: InvoiceType,
    example: InvoiceType.EXPENSE,
  })
  @ApiProperty({ enumName: 'InvoiceType' })
  type: InvoiceType;

  constructor(invoiceItem: InvoiceItem) {
    this.id = invoiceItem.id;
    this.name = invoiceItem.name;
    this.note = invoiceItem.note || null;
    this.price = invoiceItem.price;
    this.quantity = invoiceItem.quantity;
    this.type = invoiceItem.type;
  }
}

export class InvoiceResponseDto {
  constructor(invoice: Invoice) {
    this.id = invoice.id;
    this.date = invoice.date;
    this.currency = invoice.currency;
    this.total = invoice.total;
    if (invoice.items) {
      this.items = invoice.items.map(
        (item) => new InvoiceItemResponseDto(item),
      );
    }
    if (invoice.userOrganizationInvoices) {
      // For now, each invoices only has one userOrganizationInvoices
      this.creator = new OrganizationUserResponseDto(
        invoice.userOrganizationInvoices[0].userOrganization.user,
        invoice.userOrganizationInvoices[0].userOrganization,
      );
    }
    this.createdAt = invoice.createdAt;
  }

  @ApiResponseProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiResponseProperty({
    type: Date,
    example: '2024-02-26T07:31:35.000Z',
  })
  date: Date;

  @ApiResponseProperty({
    enum: CurrencyType,
    example: CurrencyType.VND,
  })
  @ApiProperty({ enumName: 'CurrencyType' })
  currency: CurrencyType;

  @ApiResponseProperty({
    type: Number,
    example: 10,
  })
  total: number;

  @ApiResponseProperty({
    type: [InvoiceItemResponseDto],
  })
  items: InvoiceItemResponseDto[];

  @ApiResponseProperty({
    type: OrganizationUserResponseDto,
  })
  creator: OrganizationUserResponseDto;

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
