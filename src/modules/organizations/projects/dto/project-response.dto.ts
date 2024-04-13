import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Project } from 'src/db/entities';
import { ProjectSearchRequestDto } from './project-search-request.dto';

export class ProjectResponseDto {
  constructor(project: Project) {
    this.id = project.id;
    this.name = project.name;
    this.description = project.description;
    this.totalBudget = project.totalBudget;
    this.startDate = project.startDate;
    this.endDate = project.endDate;
    this.createdAt = project.createdAt;
  }

  @ApiResponseProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiResponseProperty({
    type: String,
    example: 'Technology Investment',
  })
  name: string;

  @ApiResponseProperty({
    type: String,
    example: 'A project to improve school technology',
  })
  description: string;

  @ApiResponseProperty({
    type: Number,
    example: 100000,
  })
  totalBudget: number;

  @ApiResponseProperty({
    type: Date,
    example: '2024-02-26T07:31:35.000Z',
  })
  startDate: Date;

  @ApiResponseProperty({
    type: Date,
    example: '2024-02-26T07:31:35.000Z',
  })
  endDate: Date;

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
    type: ProjectSearchRequestDto,
  })
  params: ProjectSearchRequestDto;
}

export class ProjectResponseListDto {
  @ApiResponseProperty({
    type: [ProjectResponseDto],
  })
  projects: ProjectResponseDto[];

  @ApiResponseProperty({
    type: MetaData,
  })
  metadata: MetaData;
}
