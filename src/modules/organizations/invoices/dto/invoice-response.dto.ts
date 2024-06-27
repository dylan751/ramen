import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { CurrencyType, Invoice, InvoiceType } from 'src/db/entities';
import { InvoiceSearchRequestDto } from './invoice-search-request.dto';
import { OrganizationUserResponseDto } from 'src/modules/common/dto/organization-user-response.dto';
import { InvoiceItem } from 'src/db/entities/invoice-item.entity';
import { ProjectResponseDto } from '../../projects/dto/project-response.dto';
import { CategoryResponseDto } from '../../projects/categories/dto/category-response.dto';

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

  constructor(invoiceItem: InvoiceItem) {
    this.id = invoiceItem.id;
    this.name = invoiceItem.name;
    this.note = invoiceItem.note || null;
    this.price = invoiceItem.price;
    this.quantity = invoiceItem.quantity;
  }
}

export class InvoiceResponseDto {
  constructor(invoice: Invoice) {
    this.id = invoice.id;
    this.date = invoice.date;
    this.uid = invoice.uid;
    this.type = invoice.type;
    this.currency = invoice.currency;
    this.clientName = invoice.clientName;
    this.tax = invoice.tax;
    this.discount = invoice.discount;
    this.note = invoice.note || null;
    this.total = invoice.total;
    this.exchangeRate = invoice.exchangeRate;
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
    if (invoice.project) {
      this.project = new ProjectResponseDto(invoice.project);
    }
    if (invoice.category) {
      this.category = new CategoryResponseDto(invoice.category);
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
    type: String,
    example: 'INV-EF5',
  })
  uid: string;

  @ApiResponseProperty({
    enum: InvoiceType,
    example: InvoiceType.EXPENSE,
  })
  @ApiProperty({ enumName: 'InvoiceType' })
  type: InvoiceType;

  @ApiResponseProperty({
    enum: CurrencyType,
    example: CurrencyType.VND,
  })
  @ApiProperty({ enumName: 'CurrencyType' })
  currency: CurrencyType;

  @ApiResponseProperty({
    type: String,
    example: 'John Doe',
  })
  clientName: string;

  @ApiResponseProperty({
    type: Number,
    example: 10,
  })
  tax: number;

  @ApiResponseProperty({
    type: Number,
    example: 10,
  })
  discount: number;

  @ApiResponseProperty({
    type: String,
    example: 'Pay monthly internet bill',
  })
  note: string;

  @ApiResponseProperty({
    type: Number,
    example: 10,
  })
  total: number;

  @ApiResponseProperty({
    type: Number,
    example: 10,
  })
  exchangeRate: number;

  @ApiResponseProperty({
    type: [InvoiceItemResponseDto],
  })
  items: InvoiceItemResponseDto[];

  @ApiResponseProperty({
    type: ProjectResponseDto,
  })
  project: ProjectResponseDto;

  @ApiResponseProperty({
    type: CategoryResponseDto,
  })
  category: CategoryResponseDto;

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
