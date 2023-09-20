import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { OrganizationRepository, UserRepository } from 'src/db/repositories';

@Module({
  controllers: [OrganizationsController],
  providers: [OrganizationsService, OrganizationRepository, UserRepository],
})
export class OrganizationsModule {}
