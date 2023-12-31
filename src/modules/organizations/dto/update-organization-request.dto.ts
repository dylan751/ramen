import { PartialType } from '@nestjs/mapped-types';
import { CreateOrganizationRequestDto } from './create-organization-request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Validate } from 'class-validator';
import { OrganizationUniqueNameValidator } from 'src/modules/common/validators/organization-unique-name.validator';

export class UpdateOrganizationRequestDto extends PartialType(
  CreateOrganizationRequestDto,
) {
  @ApiProperty({
    type: String,
    example: 'Example organization',
    required: false,
  })
  @IsOptional()
  readonly name?: string;

  @ApiProperty({
    type: String,
    example: 'example-org',
    required: false,
  })
  @IsOptional()
  @Validate(OrganizationUniqueNameValidator)
  readonly uniqueName?: string;
}
