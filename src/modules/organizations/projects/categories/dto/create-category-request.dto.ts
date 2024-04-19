import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { ColorType, InvoiceType } from 'src/db/entities';

export class CreateCategoryRequestDto {
  @ApiProperty({
    type: String,
    example: 'Computer Expense',
    required: true,
  })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    type: ColorType,
    enum: ColorType,
    enumName: 'ColorType',
    example: ColorType.PRIMARY,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(ColorType)
  readonly color: ColorType;

  @ApiProperty({
    type: String,
    example: 'mdi:circle-outline',
    required: true,
  })
  @IsNotEmpty()
  readonly icon: string;

  @ApiProperty({
    type: InvoiceType,
    enum: InvoiceType,
    enumName: 'InvoiceType',
    example: InvoiceType.EXPENSE,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(InvoiceType)
  readonly type: InvoiceType;
}

export class CreateCategoriesRequestDto {
  @ApiProperty({
    type: [CreateCategoryRequestDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCategoryRequestDto)
  readonly categories: CreateCategoryRequestDto[];
}
