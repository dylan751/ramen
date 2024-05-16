import { IsNotEmpty, IsNumber } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserOrganizationInvoice } from './user-organization-invoice.entity';
import { InvoiceItem } from './invoice-item.entity';
import { Category } from './category.entity';
import { Project } from './project.entity';

export enum InvoiceType {
  EXPENSE = 'expense',
  INCOME = 'income',
}

export enum InvoiceStatus {
  CATEGORIZED = 'categorized',
  UNCATEGORIZED = 'uncategorized',
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
  @IsNotEmpty()
  uid: string;

  @Column()
  @IsNumber()
  total: number;

  @Column()
  @IsNumber()
  exchangeRate: number;

  @Column({
    type: 'enum',
    enum: InvoiceType,
    enumName: 'InvoiceType',
  })
  @IsNotEmpty()
  type: InvoiceType;

  @Column({
    type: 'enum',
    enum: CurrencyType,
    enumName: 'CurrencyType',
  })
  @IsNotEmpty()
  currency: CurrencyType;

  @Column()
  @IsNotEmpty()
  clientName: string;

  @Column()
  @IsNumber()
  tax: number;

  @Column()
  @IsNumber()
  organizationId: number;

  @Column()
  @IsNumber()
  projectId: number;

  @Column()
  @IsNumber()
  categoryId: number;

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

  @ManyToOne(() => Project, (project) => project.invoices)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @ManyToOne(() => Category, (category) => category.invoices)
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}
