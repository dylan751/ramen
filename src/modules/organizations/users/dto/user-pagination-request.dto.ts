import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsPositive } from 'class-validator';
import { SortOrder } from 'src/modules/common/utils/pagination';

export enum UserSortField {
  NAME = 'name',
  EMAIL = 'email',
  ROLE = 'role',
  STATUS = 'status',
}

export class UserPaginationRequestDto {
  @ApiProperty({ required: false })
  @Transform(({ value: page }) => parseInt(page), { toClassOnly: true })
  @IsOptional()
  @IsPositive()
  page: number;

  @ApiProperty({ required: false })
  @Transform(({ value: limit }) => parseInt(limit), { toClassOnly: true })
  @IsOptional()
  @IsPositive()
  limit: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(UserSortField)
  sortField: UserSortField;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value: order }) => order.toUpperCase(), { toClassOnly: true })
  @IsEnum(SortOrder)
  order: SortOrder;
}
