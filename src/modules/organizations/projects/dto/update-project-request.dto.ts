import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateProjectRequestDto {
  @ApiProperty({
    type: String,
    example: 'Technology Investment',
    required: false,
  })
  @IsOptional()
  readonly name?: string;

  @ApiProperty({
    type: String,
    example: 'A project to improve school technology',
    required: false,
  })
  @IsOptional()
  readonly description?: string;

  @ApiProperty({
    type: String,
    example: 100000,
    required: false,
  })
  @IsOptional()
  readonly totalBudget?: number;

  @ApiProperty({
    type: Date,
    example: '2024-02-26T07:31:35.000Z',
    required: false,
  })
  @IsOptional()
  readonly startDate?: Date;

  @ApiProperty({
    type: Date,
    example: '2024-02-26T07:31:35.000Z',
    required: false,
  })
  @IsOptional()
  readonly endDate?: Date;
}
