import { Injectable, NotFoundException } from '@nestjs/common';
import { InvoiceRepository } from 'src/db/repositories/invoice.repository';
import { CreateInvoiceRequestDto } from './dto/create-invoice-request.dto';
import {
  CurrencyType,
  Invoice,
  InvoiceItem,
  UserOrganizationInvoice,
} from 'src/db/entities';
import { UpdateInvoiceRequestDto } from './dto/update-invoice-request.dto';
import { InvoiceItemRepository } from 'src/db/repositories';
import { InvoiceSearchRequestDto } from '../../invoices/dto/invoice-search-request.dto';
import {
  InvoiceResponseDto,
  InvoiceResponseListDto,
} from '../../invoices/dto/invoice-response.dto';

@Injectable()
export class ProjectInvoicesService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly invoiceItemRepository: InvoiceItemRepository,
  ) {}

  async create(
    organizationId: number,
    projectId: number,
    request: CreateInvoiceRequestDto,
    userId: number,
  ): Promise<Invoice> {
    const {
      date,
      type,
      currency,
      clientName,
      uid,
      tax,
      exchangeRate,
      items,
      categoryId,
    } = request;

    // Create invoice
    const invoice = new Invoice();
    invoice.uid = uid;
    invoice.date = date;
    invoice.organizationId = organizationId;
    invoice.projectId = projectId;
    invoice.categoryId = categoryId;
    invoice.type = type;
    invoice.currency = currency;
    invoice.clientName = clientName;
    invoice.tax = tax;
    invoice.exchangeRate =
      invoice.currency === CurrencyType.USD ? 1 : exchangeRate; // If USD, then the exchange rate is 1 (1 USD = 1 USD)

    let total = items.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.price * currentValue.quantity;
    }, 0);
    const invoiceTax = invoice.tax ? invoice.tax / 100 : 0; // tax can be null

    total += total * invoiceTax;
    invoice.total = total;

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
    projectId: number,
    search: InvoiceSearchRequestDto,
  ): Promise<InvoiceResponseListDto> {
    const invoices =
      await this.invoiceRepository.findInvoicesForProjectOfOrganization(
        organizationId,
        projectId,
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

  async update(
    organizationId: number,
    projectId: number,
    invoiceId: number,
    req: UpdateInvoiceRequestDto,
  ) {
    const {
      date,
      type,
      currency,
      clientName,
      uid,
      tax,
      exchangeRate,
      items,
      categoryId,
    } = req;
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId, organizationId, projectId },
    });

    if (!invoice) {
      throw new NotFoundException(
        `Invoice ${invoiceId} does not belong to the organization ${organizationId}, project ${projectId}`,
      );
    }

    if (date) invoice.date = date;
    if (currency) {
      invoice.currency = currency;
      invoice.exchangeRate =
        invoice.currency === CurrencyType.USD ? 1 : exchangeRate; // If USD, then the exchange rate is 1 (1 USD = 1 USD)
    }
    if (clientName) invoice.clientName = clientName;
    if (uid) invoice.uid = uid;
    if (tax) invoice.tax = tax;
    if (exchangeRate)
      invoice.exchangeRate =
        invoice.currency === CurrencyType.USD ? 1 : exchangeRate; // If USD, then the exchange rate is 1 (1 USD = 1 USD)
    if (type) invoice.type = type;
    if (categoryId) invoice.categoryId = categoryId;
    if (items.length > 0) {
      let total = items.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.price * currentValue.quantity;
      }, 0);
      const invoiceTax = invoice.tax ? invoice.tax / 100 : 0; // tax can be null

      total += total * invoiceTax;
      invoice.total = total;

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
}
