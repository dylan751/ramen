import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ColorType, InvoiceType } from 'src/db/entities';

export class UpdateCategoryRequestDto {
  @ApiProperty({
    type: String,
    example: 'Computer Expense',
    required: false,
  })
  @IsOptional()
  readonly name?: string;

  @ApiProperty({
    type: ColorType,
    enum: ColorType,
    enumName: 'ColorType',
    example: ColorType.PRIMARY,
    required: false,
  })
  @IsOptional()
  @IsEnum(ColorType)
  readonly color?: ColorType;

  @ApiProperty({
    type: String,
    example: 'mdi:circle-outline',
    required: false,
  })
  @IsOptional()
  readonly icon?: string;

  @ApiProperty({
    type: InvoiceType,
    enum: InvoiceType,
    enumName: 'InvoiceType',
    example: InvoiceType.EXPENSE,
    required: false,
  })
  @IsOptional()
  @IsEnum(InvoiceType)
  readonly type?: InvoiceType;
}
