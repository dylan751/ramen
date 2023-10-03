import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { UserOrganization } from './user-organization.entity';

@Entity('user_organization_roles')
export class UserOrganizationRole extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  organizationId: number;

  @Column()
  roleId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Role, (role) => role.userOrganizationRoles)
  role: Role;

  @ManyToOne(
    () => UserOrganization,
    (userOrganization) => userOrganization.userOrganizationRoles,
  )
  @JoinColumn([
    { name: 'userId', referencedColumnName: 'userId' },
    { name: 'organizationId', referencedColumnName: 'organizationId' },
  ])
  userOrganization: UserOrganization;
}
