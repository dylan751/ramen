import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganizationUsersModule } from './modules/organizations/users/users.module';
import { dataSourceOptions } from './db/data-source';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { OrganizationRolesModule } from './modules/organizations/roles/roles.module';
import { AuthModule } from './modules/auth/auth.module';
import { RouterModule } from '@nestjs/core';
import { routes } from './route';

@Module({
  imports: [
    RouterModule.register(routes),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    OrganizationsModule,
    OrganizationUsersModule,
    OrganizationRolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
