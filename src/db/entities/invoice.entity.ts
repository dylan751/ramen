import { IsNotEmpty, IsNumber } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserOrganizationInvoice } from './user-organization-invoice.entity';
import { InvoiceItem } from './invoice-item.entity';

export enum InvoiceType {
  EXPENSE = 'expense',
  INCOME = 'income',
}

export enum CurrencyType {
  VND = 'vnd',
  USD = 'usd',
}

@Entity('invoices')
export class Invoice extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  date: Date;

  @Column()
  @IsNumber()
  organizationId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => InvoiceItem, (invoiceItem) => invoiceItem.invoice)
  items: InvoiceItem[];

  @OneToMany(
    () => UserOrganizationInvoice,
    (userOrganizationInvoice) => userOrganizationInvoice.invoice,
  )
  @JoinColumn({ name: 'id' })
  userOrganizationInvoices: UserOrganizationInvoice[];
}
