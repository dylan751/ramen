import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { PermissionAction, PermissionSubject } from 'src/db/entities';

export type PermissionCheckerParams = [PermissionAction, PermissionSubject];
export const PERMISSION_CHECKER = 'permission_checker';
export const CheckPermissions = (
  param: PermissionCheckerParams,
): CustomDecorator<string> => SetMetadata(PERMISSION_CHECKER, param);
