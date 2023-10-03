import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserOrganization } from 'src/db/entities';

@Injectable()
export class UserOrganizationRepository extends Repository<UserOrganization> {
  constructor(private dataSource: DataSource) {
    super(UserOrganization, dataSource.createEntityManager());
  }

  async countUsers(organizationId: number): Promise<number> {
    return this.count({
      where: {
        organizationId,
      },
    });
  }
}
