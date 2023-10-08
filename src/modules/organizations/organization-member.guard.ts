import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedRequest } from 'src/modules/common/types/authenticated-request';

@Injectable()
export class OrganizationMemberGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    // TODO: revisit if checking `request.params.id` and `request.body.orgId` is needed
    //        especially `request.params.id` looks dangerous
    const organizationId =
      request.params.organizationId || request.params.id || request.body.orgId;

    const selectedOrg = request.user.organizations.find(
      (org) => org.id === Number(organizationId),
    );
    if (selectedOrg) {
      return true;
    }

    throw new UnauthorizedException(
      'You are not allowed to access this organization resources',
    );
  }
}
