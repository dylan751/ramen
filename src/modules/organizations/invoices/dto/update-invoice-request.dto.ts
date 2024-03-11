import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoiceRequestDto } from './create-invoice-request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, MaxLength } from 'class-validator';
import { InvoiceType } from 'src/db/entities';

export class UpdateInvoiceRequestDto extends PartialType(
  CreateInvoiceRequestDto,
) {
  @ApiProperty({
    type: String,
    example: 'Monthly bill',
    required: false,
  })
  @MaxLength(24)
  @IsOptional()
  readonly name?: string;

  @ApiProperty({
    type: String,
    example: 'Pay monthly internet bill',
    required: false,
  })
  @IsOptional()
  readonly note?: string;

  @ApiProperty({
    type: Number,
    example: 100000,
    required: false,
  })
  @IsOptional()
  readonly amount?: number;

  @ApiProperty({
    type: Date,
    example: '2024-02-26T07:31:35.000Z',
    required: false,
  })
  @IsOptional()
  readonly date?: Date;

  @ApiProperty({
    enumName: 'InvoiceType',
    example: InvoiceType.EXPENSE,
    required: false,
  })
  @IsOptional()
  readonly type?: InvoiceType;
}
