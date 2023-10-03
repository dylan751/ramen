import { Validate } from 'class-validator';
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

@Entity('organizations')
export class Organization extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  @Validate(OrganizationUniqueNameValidator)
  uniqueName: string;

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
}
