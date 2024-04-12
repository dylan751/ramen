import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvoiceRequestDto } from './dto/create-invoice-request.dto';
import { UpdateInvoiceRequestDto } from './dto/update-invoice-request.dto';
import { InvoiceRepository } from 'src/db/repositories/invoice.repository';
import { Invoice, UserOrganizationInvoice } from 'src/db/entities';
import {
  InvoiceResponseListDto,
  InvoiceResponseDto,
} from './dto/invoice-response.dto';
import { InvoiceSearchRequestDto } from './dto/invoice-search-request.dto';
import { InvoiceItem } from 'src/db/entities/invoice-item.entity';
import { InvoiceItemRepository } from 'src/db/repositories/invoice-item.repository';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly invoiceItemRepository: InvoiceItemRepository,
  ) {}

  async create(
    organizationId: number,
    request: CreateInvoiceRequestDto,
    userId: number,
  ): Promise<Invoice> {
    const { date, type, currency, items } = request;

    // Create invoice
    const invoice = new Invoice();
    invoice.date = date;
    invoice.organizationId = organizationId;
    invoice.type = type;
    invoice.currency = currency;
    invoice.total = items.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.price * currentValue.quantity;
    }, 0);

    await this.invoiceRepository.manager.transaction(async (manager) => {
      await manager.save(Invoice, invoice);

      // Create invoice_items
      const invoiceItems: InvoiceItem[] = [];
      items.forEach((item) => {
        const invoiceItem = new InvoiceItem();
        invoiceItem.name = item.name;
        invoiceItem.note = item.note;
        invoiceItem.price = item.price;
        invoiceItem.quantity = item.quantity;
        invoiceItem.invoiceId = invoice.id;
        invoiceItems.push(invoiceItem);
      });

      // Create user_organization_invoice
      const userOrganizationInvoice = new UserOrganizationInvoice();
      userOrganizationInvoice.invoiceId = invoice.id;
      userOrganizationInvoice.userId = userId;
      userOrganizationInvoice.organizationId = organizationId;

      await manager.save(InvoiceItem, invoiceItems);
      await manager.save(UserOrganizationInvoice, userOrganizationInvoice);

      invoice.items = invoiceItems;
    });

    return invoice;
  }

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

  async update(
    organizationId: number,
    invoiceId: number,
    req: UpdateInvoiceRequestDto,
  ) {
    const { date, type, currency, items } = req;
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId, organizationId },
    });

    if (!invoice) {
      throw new NotFoundException(
        `Invoice ${invoiceId} does not belong to the organization ${organizationId}`,
      );
    }

    if (date) invoice.date = date;
    if (currency) invoice.currency = currency;
    if (type) invoice.type = type;
    if (items.length > 0) {
      invoice.total = items.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.price * currentValue.quantity;
      }, 0);

      await this.invoiceRepository.manager.transaction(async (manager) => {
        // Save invoice
        // Delete previous invoice items
        // Save new invoice items
        await manager.save(Invoice, invoice);
        const oldInvoiceItems =
          await this.invoiceItemRepository.findByInvoiceId(invoiceId);
        await manager.delete(InvoiceItem, oldInvoiceItems);

        const invoiceItems: InvoiceItem[] = [];
        items.forEach((item) => {
          const invoiceItem = new InvoiceItem();
          invoiceItem.name = item.name;
          invoiceItem.note = item.note;
          invoiceItem.price = item.price;
          invoiceItem.quantity = item.quantity;
          invoiceItem.invoiceId = invoiceId;
          invoiceItems.push(invoiceItem);
        });
        await manager.save(InvoiceItem, invoiceItems);
        invoice.items = invoiceItems;
      });
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
