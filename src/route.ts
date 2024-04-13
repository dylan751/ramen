import { Routes } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { OrganizationUsersModule } from './modules/organizations/users/users.module';
import { OrganizationRolesModule } from './modules/organizations/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { OrganizationInvoicesModule } from './modules/organizations/invoices/invoices.module';
import { OrganizationProjectsModule } from './modules/organizations/projects/projects.module';

export const routes: Routes = [
  // Internal APIs
  {
    path: '/internal/api/v1',
    module: OrganizationsModule,
    children: [
      {
        path: 'organizations/:organizationId',
        module: OrganizationUsersModule,
      },
      {
        path: 'organizations/:organizationId',
        module: OrganizationRolesModule,
      },
      {
        path: 'organizations/:organizationId',
        module: OrganizationInvoicesModule,
      },
      {
        path: 'organizations/:organizationId',
        module: OrganizationProjectsModule,
      },
    ],
  },

  {
    path: '/internal/api/v1',
    module: AuthModule,
  },
  {
    path: '/internal/api/v1',
    module: PermissionsModule,
  },
];
