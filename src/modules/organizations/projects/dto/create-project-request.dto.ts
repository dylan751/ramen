import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';

export class CreateProjectRequestDto {
  @ApiProperty({
    type: String,
    example: 'Technology Investment',
    required: true,
  })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    type: String,
    example: 'A project to improve school technology',
    required: true,
  })
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty({
    type: String,
    example: 100000,
    required: true,
  })
  @IsNotEmpty()
  readonly totalBudget: number;

  @ApiProperty({
    type: Date,
    example: '2024-02-26T07:31:35.000Z',
    required: true,
  })
  @IsNotEmpty()
  readonly startDate: Date;

  @ApiProperty({
    type: Date,
    example: '2024-02-26T07:31:35.000Z',
    required: true,
  })
  @IsNotEmpty()
  readonly endDate: Date;
}

export class CreateProjectsRequestDto {
  @ApiProperty({
    type: [CreateProjectRequestDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProjectRequestDto)
  readonly projects: CreateProjectRequestDto[];
}
