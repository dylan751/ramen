import { Module } from '@nestjs/common';
import { ProjectInvoicesService } from './invoices.service';
import { ProjectInvoicesController } from './invoices.controller';
import { InvoiceRepository } from 'src/db/repositories/invoice.repository';
import { MetadataScanner } from '@nestjs/core';
import { AuthzModule } from 'src/modules/authz/authz.module';
import { InvoiceItemRepository } from 'src/db/repositories/invoice-item.repository';

@Module({
  imports: [AuthzModule],
  controllers: [ProjectInvoicesController],
  providers: [
    MetadataScanner,
    ProjectInvoicesService,
    InvoiceRepository,
    InvoiceItemRepository,
  ],
})
class InvoicesModule {}

export { InvoicesModule as OrganizationProjectInvoicesModule };
