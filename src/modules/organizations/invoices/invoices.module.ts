import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { InvoiceRepository } from 'src/db/repositories/invoice.repository';
import { MetadataScanner } from '@nestjs/core';
import { AuthzModule } from 'src/modules/authz/authz.module';
import { InvoiceItemRepository } from 'src/db/repositories/invoice-item.repository';

@Module({
  imports: [AuthzModule],
  controllers: [InvoicesController],
  providers: [
    MetadataScanner,
    InvoicesService,
    InvoiceRepository,
    InvoiceItemRepository,
  ],
})
class InvoicesModule {}

export { InvoicesModule as OrganizationInvoicesModule };
