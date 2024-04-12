import { IsNotEmpty } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Invoice, InvoiceType } from './invoice.entity';
import { Budget } from './budget.entity';

@Entity('categories')
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsNotEmpty()
  color: string;

  @Column()
  @IsNotEmpty()
  icon: string;

  @Column({
    type: 'enum',
    enum: InvoiceType,
    enumName: 'InvoiceType',
  })
  @IsNotEmpty()
  type: InvoiceType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Invoice, (invoice) => invoice.category)
  invoices: Invoice[];

  @OneToMany(() => Budget, (budget) => budget.category)
  budgets: Budget[];
}
