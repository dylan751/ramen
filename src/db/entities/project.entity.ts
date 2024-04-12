import { IsNotEmpty, IsNumber } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Budget } from './budget.entity';
import { Invoice } from './invoice.entity';

@Entity('projects')
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsNotEmpty()
  description: string;

  @Column()
  @IsNumber()
  totalBudget: number;

  @Column()
  @IsNotEmpty()
  startDate: Date;

  @Column()
  @IsNotEmpty()
  endDate: Date;

  @Column()
  @IsNumber()
  organizationId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Invoice, (invoice) => invoice.project)
  invoices: Invoice[];

  @OneToMany(() => Budget, (budget) => budget.project)
  budgets: Budget[];
}
