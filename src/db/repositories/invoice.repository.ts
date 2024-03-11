import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Invoice } from 'src/db/entities';
import { InvoiceSearchRequestDto } from 'src/modules/organizations/invoices/dto/invoice-search-request.dto';
import { isAfter, isBefore, isEqual } from 'date-fns';

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
      .innerJoin('invoice.userOrganizationInvoices', 'userOrganizationInvoices')
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
      .leftJoinAndSelect(
        'invoice.userOrganizationInvoices',
        'userOrganizationInvoices',
      )
      .leftJoinAndSelect(
        'userOrganizationInvoices.userOrganization',
        'userOrganization',
      )
      .leftJoinAndSelect('userOrganization.user', 'user')
      .leftJoinAndSelect('userOrganization.roles', 'roles')
      .where('invoice.organizationId = :organizationId', { organizationId })
      .getMany();

    let filteredInvoices = allInvoices;
    if (search.query) {
      const queryLowered = search.query.toLowerCase();
      filteredInvoices = allInvoices.filter(
        (invoice) =>
          invoice.name.toLowerCase().includes(queryLowered) ||
          invoice.note.toLowerCase().includes(queryLowered),
      );
    }

    if (search.fromDate) {
      filteredInvoices = filteredInvoices.filter(
        (invoice) =>
          isAfter(invoice.date, new Date(search.fromDate)) ||
          isEqual(invoice.date, new Date(search.fromDate)),
      );
    }

    if (search.toDate) {
      filteredInvoices = filteredInvoices.filter(
        (invoice) =>
          isBefore(invoice.date, new Date(search.toDate)) ||
          isEqual(invoice.date, new Date(search.toDate)),
      );
    }

    if (search.type) {
      filteredInvoices = filteredInvoices.filter(
        (invoice) => invoice.type === search.type,
      );
    }

    return filteredInvoices;
  }

  async findInvoiceForOrganization(
    organizationId: number,
    id: number,
  ): Promise<Invoice> {
    return await this.createQueryBuilder('invoice')
      .leftJoinAndSelect(
        'invoice.userOrganizationInvoices',
        'userOrganizationInvoices',
      )
      .leftJoinAndSelect(
        'userOrganizationInvoices.userOrganization',
        'userOrganization',
      )
      .leftJoinAndSelect('userOrganization.user', 'user')
      .leftJoinAndSelect('userOrganization.roles', 'roles')
      .where('invoice.organizationId = :organizationId', { organizationId })
      .andWhere('invoice.id = :id', { id })
      .getOne();
  }
}
