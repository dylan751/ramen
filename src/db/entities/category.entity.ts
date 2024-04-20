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

export enum ColorType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  ERROR = 'error',
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
}

export enum IconType {
  MDI_INVOICE_ADD = 'mdi:invoice-add',
  MDI_INVOICE_MINUS = 'mdi:invoice-minus',
  MDI_INVOICE_TEXT_CHECK_OUTLINE = 'mdi:invoice-text-check-outline',
  MDI_INVOICE_TEXT_SEND_OUTLINE = 'mdi:invoice-text-send-outline',
  MDI_CATEGORY_OUTLINE = 'mdi:category-outline',
  MDI_CATEGORY_PLUS_OUTLINE = 'mdi:category-plus-outline',
  MDI_COMPUTER = 'mdi:computer',
  MDI_ACCOUNT_BADGE_OUTLINE = 'mdi:account-badge-outline',
  MDI_MEDICINE_BOTTLE_OUTLINE = 'mdi:medicine-bottle-outline',
  MDI_AIRPLANE = 'mdi:airplane',
  MDI_CAR_OUTLINE = 'mdi:car-outline',
  MDI_IMPORT = 'mdi:import',
  MDI_EXPORT = 'mdi:export',
  MDI_CREDIT_CARD_ADD = 'mdi:credit-card-add',
  MDI_EMAIL_ADD_OUTLINE = 'mdi:email-add-outline',
}

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

  @Column({
    type: 'enum',
    enum: ColorType,
    enumName: 'ColorType',
  })
  @IsNotEmpty()
  color: ColorType;

  @Column({
    type: 'enum',
    enum: IconType,
    enumName: 'IconType',
  })
  @IsNotEmpty()
  icon: IconType;

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
