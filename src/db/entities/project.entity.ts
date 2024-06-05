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
import { Budget } from './budget.entity';
import { Invoice } from './invoice.entity';
import { User } from './user.entity';
import { Category } from './category.entity';
import { Organization } from './organization.entity';

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

  @Column()
  @IsNumber()
  creatorId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Invoice, (invoice) => invoice.project)
  invoices: Invoice[];

  @OneToMany(() => Budget, (budget) => budget.project)
  budgets: Budget[];

  @OneToMany(() => Category, (category) => category.project)
  categories: Category[];

  @ManyToOne(() => User, (creator) => creator.projects)
  @JoinColumn({ name: 'creatorId' })
  creator: User;

  @ManyToOne(() => Organization, (organization) => organization.projects)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;
}
