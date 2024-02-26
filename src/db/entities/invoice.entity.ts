import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
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

export enum InvoiceType {
  EXPENSE = 'expense',
  INCOME = 'income',
}

@Entity('invoices')
export class Invoice extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsOptional()
  note?: string;

  @Column()
  @IsNumber()
  amount: number;

  @Column()
  @IsNotEmpty()
  date: Date;

  @Column({
    type: 'enum',
    enum: InvoiceType,
  })
  @IsNotEmpty()
  type: InvoiceType;

  @Column()
  @IsNumber()
  organizationId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => UserOrganizationInvoice,
    (userOrganizationInvoice) => userOrganizationInvoice.invoice,
  )
  @JoinColumn({ name: 'id' })
  userOrganizationInvoices: UserOrganizationInvoice[];
}
