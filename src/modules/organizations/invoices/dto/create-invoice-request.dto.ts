import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { InvoiceType } from 'src/db/entities';

export class CreateInvoiceRequestDto {
  @ApiProperty({
    type: String,
    example: 'Monthly bill',
    required: true,
  })
  @MaxLength(24)
  @IsNotEmpty()
  readonly name: string;

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
    required: true,
  })
  @IsNotEmpty()
  readonly amount: number;

  @ApiProperty({
    type: Date,
    example: '2024/02/01',
    required: true,
  })
  @IsNotEmpty()
  readonly date: Date;

  @ApiProperty({
    enumName: 'InvoiceType',
    example: InvoiceType.EXPENSE,
    required: true,
  })
  @IsNotEmpty()
  readonly type: InvoiceType;
}

export class CreateInvoicesRequestDto {
  @ApiProperty({
    type: [CreateInvoiceRequestDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceRequestDto)
  readonly invoices: CreateInvoiceRequestDto[];
}
