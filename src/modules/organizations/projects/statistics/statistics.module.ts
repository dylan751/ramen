import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { MetadataScanner } from '@nestjs/core';
import { AuthzModule } from 'src/modules/authz/authz.module';
import {
  BudgetRepository,
  CategoryRepository,
  InvoiceRepository,
  ProjectRepository,
} from 'src/db/repositories';

@Module({
  imports: [AuthzModule],
  controllers: [StatisticsController],
  providers: [
    MetadataScanner,
    StatisticsService,
    ProjectRepository,
    InvoiceRepository,
    BudgetRepository,
    CategoryRepository,
  ],
})
class StatisticsModule {}

export { StatisticsModule as OrganizationProjectStatisticsModule };
