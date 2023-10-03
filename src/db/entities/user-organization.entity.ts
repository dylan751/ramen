import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Organization } from './organization.entity';
import { Role } from './role.entity';
import { UserOrganizationRole } from './user-organization-role.entity';
import { User } from './user.entity';

export enum UserOrganizationStatus {
  ACTIVE = 'active',
  INVITED = 'invited',
}

@Entity('user_organizations')
export class UserOrganization extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  organizationId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.userOrganizations)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(
    () => Organization,
    (organization) => organization.userOrganizations,
  )
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @OneToMany(
    () => UserOrganizationRole,
    (userOrganizationRole) => userOrganizationRole.userOrganization,
  )
  userOrganizationRoles: UserOrganizationRole[];

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_organization_roles',
    joinColumns: [
      { name: 'userId', referencedColumnName: 'userId' },
      { name: 'organizationId', referencedColumnName: 'organizationId' },
    ],
    inverseJoinColumns: [{ name: 'roleId', referencedColumnName: 'id' }],
  })
  roles: Role[];

  isAnActiveAdmin(): boolean {
    // join roles or fetch relations while querying for this to work
    return this.roles.some((role) => role.id === Role.ADMIN_ROLE_ID);
  }
}
