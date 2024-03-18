import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InvoiceItem } from '../entities/invoice-item.entity';

@Injectable()
export class InvoiceItemRepository extends Repository<InvoiceItem> {
  constructor(private dataSource: DataSource) {
    super(InvoiceItem, dataSource.createEntityManager());
  }
  async findByInvoiceId(invoiceId: number): Promise<InvoiceItem[]> {
    return await this.find({
      where: {
        invoiceId: invoiceId,
      },
    });
  }
}
