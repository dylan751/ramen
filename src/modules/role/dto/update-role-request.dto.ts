import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleRequestDto } from './create-role-request.dto';

export class UpdateRoleRequestDto extends PartialType(CreateRoleRequestDto) {}
