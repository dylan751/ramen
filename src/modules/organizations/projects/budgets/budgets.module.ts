import { Module } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { BudgetsController } from './budgets.controller';
import { BudgetRepository } from 'src/db/repositories/budget.repository';
import { MetadataScanner } from '@nestjs/core';
import { AuthzModule } from 'src/modules/authz/authz.module';

@Module({
  imports: [AuthzModule],
  controllers: [BudgetsController],
  providers: [MetadataScanner, BudgetsService, BudgetRepository],
})
class BudgetsModule {}

export { BudgetsModule as OrganizationProjectBudgetsModule };
