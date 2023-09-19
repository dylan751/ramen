import { PartialType } from '@nestjs/mapped-types';
import { CreateRolePermissionDto } from './create-role_permission.dto';

export class UpdateRolePermissionDto extends PartialType(CreateRolePermissionDto) {}
