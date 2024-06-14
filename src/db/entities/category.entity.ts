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
  MDI_INVOICE_ARROW_LEFT_OUTLINE = 'mdi:invoice-arrow-left-outline',
  MDI_INVOICE_ARROW_RIGHT_OUTLINE = 'mdi:invoice-arrow-right-outline',
  MDI_INVOICE_LIST_OUTLINE = 'mdi:invoice-list-outline',
  MDI_INVOICE_CLOCK_OUTLINE = 'mdi:invoice-clock-outline',
  MDI_INVOICE_EDIT_OUTLINE = 'mdi:invoice-edit-outline',
  MDI_INVOICE_MINUS_OUTLINE = 'mdi:invoice-minus-outline',
  MDI_INVOICE_RECEIVE_OUTLINE = 'mdi:invoice-receive-outline',
  MDI_INVOICE_SCHEDULE_OUTLINE = 'mdi:invoice-schedule-outline',
  MDI_INVOICE_TEXT_CHECK_OUTLINE = 'mdi:invoice-text-check-outline',
  MDI_INVOICE_TEXT_REMOVE_OUTLINE = 'mdi:invoice-text-remove-outline',
  MDI_INVOICE_TEXT_PLUS_OUTLINE = 'mdi:invoice-text-plus-outline',
  MDI_INVOICE_TEXT_SEND_OUTLINE = 'mdi:invoice-text-send-outline',
  MDI_CATEGORY = 'mdi:category',
  MDI_CATEGORY_OUTLINE = 'mdi:category-outline',
  MDI_CATEGORY_PLUS = 'mdi:category-plus',
  MDI_CATEGORY_PLUS_OUTLINE = 'mdi:category-plus-outline',
  MDI_COMPUTER = 'mdi:computer',
  MDI_COMPUTER_CLASSIC = 'mdi:computer-classic',
  MDI_ACCOUNT_BADGE_OUTLINE = 'mdi:account-badge-outline',
  MDI_ACCOUNT_BOX = 'mdi:account-box',
  MDI_ACCOUNT_COG = 'mdi:account-cog',
  MDI_ACCOUNT_CASH = 'mdi:account-cash',
  MDI_ACCOUNT_EDIT = 'mdi:account-edit',
  MDI_ACCOUNT_ALERT = 'mdi:account-alert',
  MDI_ACCOUNT_BOX_OUTLINE = 'mdi:account-box-outline',
  MDI_ACCOUNT_COG_OUTLINE = 'mdi:account-cog-outline',
  MDI_ACCOUNT_CASH_OUTLINE = 'mdi:account-cash-outline',
  MDI_ACCOUNT_EDIT_OUTLINE = 'mdi:account-edit-outline',
  MDI_ACCOUNT_ALERT_OUTLINE = 'mdi:account-alert-outline',
  MDI_BADGE_ACCOUNT_OUTLINE = 'mdi:badge-account-outline',
  MDI_BOOK_ACCOUNT_OUTLINE = 'mdi:book-account-outline',
  MDI_BRIEFCASE_ACCOUNT_OUTLINE = 'mdi:briefcase-account-outline',
  MDI_MAP_MARKER_ACCOUNT_OUTLINE = 'mdi:map-marker-account-outline',
  MDI_MEDICINE = 'mdi:medicine',
  MDI_MEDICINE_OUTLINE = 'mdi:medicine-outline',
  MDI_MEDICINE_BOTTLE = 'mdi:medicine-bottle',
  MDI_MEDICINE_BOTTLE_OUTLINE = 'mdi:medicine-bottle-outline',
  MDI_MEDICINE_OFF = 'mdi:medicine-off',
  MDI_AIRPLANE = 'mdi:airplane',
  MDI_AIRPLANE_ALERT = 'mdi:airplane-alert',
  MDI_AIRPLANE_CAR = 'mdi:airplane-car',
  MDI_AIRPLANE_CLOCK = 'mdi:airplane-clock',
  MDI_AIRPLANE_COG = 'mdi:airplane-cog',
  MDI_PAPER_AIRPLANE = 'mdi:paper-airplane',
  MDI_PAPER_AIRPLANE_OUTLINE = 'mdi:paper-airplane-outline',
  MDI_PAPER_AIRPLANE_VARIANT = 'mdi:paper-airplane-variant',
  MDI_PAPER_AIRPLANE_VARIANT_OUTLINE = 'mdi:paper-airplane-variant-outline',
  MDI_CAR_OUTLINE = 'mdi:car-outline',
  MDI_CABLE_CAR = 'mdi:cable-car',
  MDI_ARROW_LEFT = 'mdi:car-arrow-left',
  MDI_ARROW_RIGHT = 'mdi:car-arrow-right',
  MDI_IMPORT = 'mdi:import',
  MDI_CALENDAR_IMPORT_OUTLINE = 'mdi:calendar-import-outline',
  MDI_FILE_IMPORT_OUTLINE = 'mdi:file-import-outline',
  MDI_EXPORT = 'mdi:export',
  MDI_CALENDAR_EXPORT_OUTLINE = 'mdi:calendar-export-outline',
  MDI_FILE_EXPORT_OUTLINE = 'mdi:file-export-outline',
  MDI_CREDIT_CARD_ADD = 'mdi:credit-card-add',
  MDI_EMAIL_CHECK_OUTLINE = 'mdi:email-check-outline',
  MDI_EMAIL_SEARCH_OUTLINE = 'mdi:email-search-outline',
  MDI_EMAIL_EDIT_OUTLINE = 'mdi:email-edit-outline',
  MDI_EMAIL_PLUS_OUTLINE = 'mdi:email-plus-outline',
  MDI_EMAIL_OFF_OUTLINE = 'mdi:email-off-outline',
  MDI_EMAIL_ADD_OUTLINE = 'mdi:email-add-outline',
  MDI_ABACUS = 'mdi:abacus',
  MDI_ACCOUNT = 'mdi:account',
  MDI_AB_TESTING = 'mdi:ab-testing',
  MDI_ABJAD_ARABIC = 'mdi:abjad-arabic',
  MDI_ABJAD_HEBREW = 'mdi:abjad-hebrew',
  MDI_ABUGIDA_THAI = 'mdi:abugida-thai',
  MDI_ACCESS_POINT = 'mdi:access-point',
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
