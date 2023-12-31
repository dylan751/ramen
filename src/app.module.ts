import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganizationUsersModule } from './modules/organizations/users/users.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { OrganizationRolesModule } from './modules/organizations/roles/roles.module';
import { AuthModule } from './modules/auth/auth.module';
import { RouterModule } from '@nestjs/core';
import { routes } from './route';
import configuration from './config/configuration';
import { dataSourceOptions } from './db/datasource/default';
import { PermissionsModule } from './modules/permissions/permissions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    RouterModule.register(routes),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    PermissionsModule,
    OrganizationsModule,
    OrganizationUsersModule,
    OrganizationRolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
