import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { ProjectRepository } from 'src/db/repositories/project.repository';
import { MetadataScanner } from '@nestjs/core';
import { AuthzModule } from 'src/modules/authz/authz.module';
import { InvoiceRepository } from 'src/db/repositories';

@Module({
  imports: [AuthzModule],
  controllers: [ProjectsController],
  providers: [
    MetadataScanner,
    ProjectsService,
    ProjectRepository,
    InvoiceRepository,
  ],
})
class ProjectsModule {}

export { ProjectsModule as OrganizationProjectsModule };
