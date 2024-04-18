import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoryRepository } from 'src/db/repositories';
import { MetadataScanner } from '@nestjs/core';
import { AuthzModule } from 'src/modules/authz/authz.module';

@Module({
  imports: [AuthzModule],
  controllers: [CategoriesController],
  providers: [MetadataScanner, CategoriesService, CategoryRepository],
})
class CategoriesModule {}

export { CategoriesModule as OrganizationProjectCategoriesModule };
