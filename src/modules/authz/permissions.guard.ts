import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PermissionAction, PermissionSubject, User } from 'src/db/entities';
import {
  PERMISSION_CHECKER,
  PermissionCheckerParams,
} from './permissions.decorator';
import { AbilityFactory } from './ability.factory';

export interface RequestWithPermissionSubbject<
  RequestParams = any,
  ResponseBody = any,
  RequestBody = any,
  RequestQuery = any,
> extends Request<RequestParams, ResponseBody, RequestBody, RequestQuery> {
  permissionData?: Record<string, any>;
  user: User;
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    /**
     * References:
     * https://www.osohq.com/academy/role-based-access-control-rbac
     * https://www.osohq.com/academy/relationship-based-access-control-rebac
     *
     * @UseGuards(PermissionsGuard) adds this guard to a controller
     *
     * 1. check if the right decorators are present and extract them
     * 2. if permissionDataExtractor exists, extract conditions data
     * 3. [rbac] check for unconditional access (admin) with ability.can
     * 4. [rebac] listResponseInterceptor is an interceptor used to manipulate the response
     * 5. [rebac] listRequestManipulator is used to manipulate req.query or req.body
     * 6. [rbac] return permission check (ability.can) if no manipulators are present
     * (detailed comments below)
     *
     * For now, just support [rbac]
     */

    const { action, subject } = this.verifyAndGetDecorators(context);

    // get user data
    const req = context
      .switchToHttp()
      .getRequest<RequestWithPermissionSubbject>();
    const user = req.user;
    const organizationId = Number(req.params?.organizationId || req.params?.id);

    const { unconditionalAbilities } = await this.abilityFactory.createForUser(
      user,
      organizationId,
    );

    return unconditionalAbilities.can(action, subject);
  }

  private verifyAndGetDecorators(context: ExecutionContext): {
    action: PermissionAction;
    subject: PermissionSubject;
  } {
    const permissionChecker = this.reflector.get<PermissionCheckerParams>(
      PERMISSION_CHECKER,
      context.getHandler(),
    );

    if (!permissionChecker)
      throw new Error('Missing permission checker decorator');

    const [action, subject] = permissionChecker;

    return { action, subject };
  }
}
