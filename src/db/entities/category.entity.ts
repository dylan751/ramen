import { IsNotEmpty, IsNumber } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Invoice, InvoiceType } from './invoice.entity';
import { Budget } from './budget.entity';
import { Project } from './project.entity';

@Entity('categories')
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNumber()
  organizationId: number;

  @Column()
  @IsNumber()
  projectId: number;

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

  @ManyToOne(() => Project, (project) => project.categories)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @OneToMany(() => Invoice, (invoice) => invoice.category)
  invoices: Invoice[];

  @OneToOne(() => Budget, (budget) => budget.category)
  budget: Budget;
}
