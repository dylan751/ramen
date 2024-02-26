import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class InvoiceSearchRequestDto {
  @ApiProperty({ required: false })
  @IsOptional()
  query: string;
}
