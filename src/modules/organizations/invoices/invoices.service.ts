import { Injectable, NotFoundException } from '@nestjs/common';
import { InvoiceRepository } from 'src/db/repositories/invoice.repository';
import { Invoice, UserOrganizationInvoice } from 'src/db/entities';
import {
  InvoiceResponseListDto,
  InvoiceResponseDto,
} from './dto/invoice-response.dto';
import { InvoiceSearchRequestDto } from './dto/invoice-search-request.dto';
import { InvoiceItem } from 'src/db/entities/invoice-item.entity';

@Injectable()
export class InvoicesService {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  async findAll(
    organizationId: number,
    search: InvoiceSearchRequestDto,
  ): Promise<InvoiceResponseListDto> {
    const invoices = await this.invoiceRepository.findInvoicesForOrganization(
      organizationId,
      search,
    );

    const invoiceDtos = invoices.map(
      (invoice) => new InvoiceResponseDto(invoice),
    );

    const result = new InvoiceResponseListDto();
    result.invoices = invoiceDtos;
    result.metadata = {
      total: invoiceDtos.length,
      params: search,
    };

    return result;
  }

  async findOne(organizationId: number, invoiceId: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findInvoiceForOrganization(
      organizationId,
      invoiceId,
    );
    if (!invoice) {
      throw new NotFoundException(
        `Invoice ${invoiceId} does not belong to the organization ${organizationId}`,
      );
    }

    return invoice;
  }

  async delete(organizationId: number, invoiceId: number): Promise<void> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId, organizationId },
    });

    if (!invoice) {
      throw new NotFoundException(
        `Invoice ${invoiceId} doesn't belong to organization ${organizationId}`,
      );
    }

    await this.invoiceRepository.manager.transaction(async (manager) => {
      const deletePromises = [];

      deletePromises.push(
        manager.delete(UserOrganizationInvoice, { organizationId, invoiceId }),
      );
      deletePromises.push(manager.delete(InvoiceItem, { invoiceId }));
      deletePromises.push(manager.delete(Invoice, { id: invoiceId }));

      await Promise.all(deletePromises);
    });
  }
}
