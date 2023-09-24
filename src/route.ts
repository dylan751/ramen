import { Routes } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { OrganizationUsersModule } from './modules/organizations/users/users.module';
import { OrganizationRolesModule } from './modules/organizations/roles/roles.module';

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
    ],
  },

  {
    path: '/internal/api/v1',
    module: AuthModule,
  },
];
