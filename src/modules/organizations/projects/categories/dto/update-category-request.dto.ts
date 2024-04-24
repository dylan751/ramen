import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ColorType, IconType, InvoiceType } from 'src/db/entities';

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
    type: IconType,
    enum: IconType,
    enumName: 'IconType',
    example: IconType.MDI_AIRPLANE,
    required: false,
  })
  @IsOptional()
  @IsEnum(IconType)
  readonly icon?: IconType;

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
