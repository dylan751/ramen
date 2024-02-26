import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Invoice } from 'src/db/entities';
import { InvoiceSearchRequestDto } from 'src/modules/organizations/invoices/dto/invoice-search-request.dto';

@Injectable()
export class InvoiceRepository extends Repository<Invoice> {
  constructor(private dataSource: DataSource) {
    super(Invoice, dataSource.createEntityManager());
  }

  async findByUserIdAndOrganizationId(
    userId: number,
    organizationId: number,
  ): Promise<Invoice[]> {
    return await this.createQueryBuilder('invoice')
      .innerJoin('role.userOrganizationInvoices', 'userOrganizationInvoices')
      .innerJoin(
        'userOrganizationInvoices.userOrganization',
        'userOrganization',
      )
      .innerJoin('userOrganization.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('userOrganizationInvoices.organizationId = :organizationId', {
        organizationId,
      })
      .getMany();
  }

  async findInvoicesForOrganization(
    organizationId: number,
    search: InvoiceSearchRequestDto,
  ): Promise<Invoice[]> {
    const allInvoices = await this.createQueryBuilder('invoice')
      .where('organizationId = :organizationId', { organizationId })
      .getMany();

    let filteredInvoices = allInvoices;
    if (search.query) {
      const queryLowered = search.query.toLowerCase();
      filteredInvoices = allInvoices.filter((role) =>
        role.name.toLowerCase().includes(queryLowered),
      );
    }

    return filteredInvoices;
  }

  async findInvoiceForOrganization(
    organizationId: number,
    id: number,
  ): Promise<Invoice> {
    return await this.createQueryBuilder('invoice')
      .where('organizationId = :organizationId', { organizationId })
      .andWhere('id = :id', { id })
      .getOne();
  }
}
