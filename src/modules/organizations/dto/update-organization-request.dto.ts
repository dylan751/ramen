import { PartialType } from '@nestjs/mapped-types';
import { CreateOrganizationRequestDto } from './create-organization-request.dto';

export class UpdateOrganizationRequestDto extends PartialType(
  CreateOrganizationRequestDto,
) {}
