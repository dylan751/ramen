import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Invoice } from './invoice.entity';
import { UserOrganization } from './user-organization.entity';

@Entity('user_organization_invoices')
export class UserOrganizationInvoice extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  organizationId: number;

  @Column()
  invoiceId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Invoice, (invoice) => invoice.userOrganizationInvoices)
  invoice: Invoice;

  @ManyToOne(
    () => UserOrganization,
    (userOrganization) => userOrganization.userOrganizationInvoices,
  )
  @JoinColumn([
    { name: 'userId', referencedColumnName: 'userId' },
    { name: 'organizationId', referencedColumnName: 'organizationId' },
  ])
  userOrganization: UserOrganization;
}
