import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { InvoiceRepository } from 'src/db/repositories/invoice.repository';
import { PermissionRepository } from 'src/db/repositories/permission.repository';
import { MetadataScanner } from '@nestjs/core';
import { AuthzModule } from 'src/modules/authz/authz.module';

@Module({
  imports: [AuthzModule],
  controllers: [InvoicesController],
  providers: [
    MetadataScanner,
    InvoicesService,
    InvoiceRepository,
    PermissionRepository,
  ],
})
class InvoicesModule {}

export { InvoicesModule as OrganizationInvoicesModule };
