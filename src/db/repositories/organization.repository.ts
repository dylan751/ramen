import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';

@Injectable()
export class OrganizationRepository extends Repository<Organization> {
  constructor(private dataSource: DataSource) {
    super(Organization, dataSource.createEntityManager());
  }

  async findById(id: number): Promise<Organization> {
    return this.findOne({ where: { id: id } });
  }

  async findByUniqueName(uniqueName: string): Promise<Organization> {
    return this.findOne({ where: { uniqueName: uniqueName } });
  }
}
