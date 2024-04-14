import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { InvoiceType } from 'src/db/entities';

export class CategorySearchRequestDto {
  @ApiProperty({ required: false })
  @IsOptional()
  query?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(InvoiceType)
  type?: InvoiceType;
}
