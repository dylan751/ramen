import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { MetadataScanner } from '@nestjs/core';
import { AuthzModule } from 'src/modules/authz/authz.module';
import {
  ProjectRepository,
  OrganizationRepository,
  InvoiceRepository,
  UserRepository,
  RoleRepository,
} from 'src/db/repositories';

@Module({
  imports: [AuthzModule],
  controllers: [StatisticsController],
  providers: [
    MetadataScanner,
    StatisticsService,
    ProjectRepository,
    OrganizationRepository,
    InvoiceRepository,
    UserRepository,
    RoleRepository,
  ],
})
class StatisticsModule {}

export { StatisticsModule as OrganizationStatisticsModule };
