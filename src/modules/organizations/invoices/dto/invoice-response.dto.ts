import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Invoice, InvoiceType } from 'src/db/entities';
import { InvoiceSearchRequestDto } from './invoice-search-request.dto';
import { OrganizationUserResponseDto } from 'src/modules/common/dto/organization-user-response.dto';

export class InvoiceResponseDto {
  constructor(invoice: Invoice) {
    this.id = invoice.id;
    this.name = invoice.name;
    this.note = invoice.note || null;
    this.amount = invoice.amount;
    this.date = invoice.date;
    this.type = invoice.type;
    this.creator = new OrganizationUserResponseDto(
      invoice.userOrganizationInvoices[0].userOrganization.user,
      invoice.userOrganizationInvoices[0].userOrganization,
    );
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
    example: '2024-02-26T07:31:35.000Z',
  })
  date: Date;

  @ApiResponseProperty({
    enum: InvoiceType,
  })
  @ApiProperty({ enumName: 'InvoiceType' })
  type: InvoiceType;

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
