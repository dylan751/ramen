import { IsNotEmpty, IsNumber, Validate } from 'class-validator';
import { OrganizationUniqueNameValidator } from 'src/modules/common/validators/organization-unique-name.validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { UserOrganization } from './user-organization.entity';
import { Project } from './project.entity';
import { CurrencyType } from './invoice.entity';

export enum BankType {
  BIDV = 'bidv',
  VCB = 'vcb',
}

@Entity('organizations')
export class Organization extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  @Validate(OrganizationUniqueNameValidator)
  uniqueName: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  dateFormat: string;

  @Column({
    type: 'enum',
    enum: CurrencyType,
    enumName: 'CurrencyType',
  })
  @IsNotEmpty()
  currency: CurrencyType;

  @Column({
    type: 'enum',
    enum: BankType,
    enumName: 'BankType',
  })
  @IsNotEmpty()
  bank: BankType;

  @Column()
  @IsNumber()
  exchangeRate: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => User, (user) => user.organizations, {
    cascade: true,
  })
  @JoinTable({
    name: 'user_organizations',
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
    joinColumn: { name: 'organizationId', referencedColumnName: 'id' },
  })
  users: User[];

  @OneToMany(
    () => UserOrganization,
    (userOrganization) => userOrganization.organization,
  )
  @JoinColumn({ name: 'id' })
  userOrganizations: UserOrganization[];

  @OneToMany(() => Project, (project) => project.organization)
  projects: Project[];
}
