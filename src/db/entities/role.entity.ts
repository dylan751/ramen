import { IsNotEmpty, IsNumber } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RolePermission } from './role-permission.entity';
import { UserOrganizationRole } from './user-organization-role.entity';

@Entity('roles')
export class Role extends BaseEntity {
  public static readonly ADMIN_ROLE_ID = 1;
  public static readonly MEMBER_ROLE_ID = 2;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsNotEmpty()
  slug: string;

  @Column()
  @IsNumber()
  organizationId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  @JoinColumn({ name: 'id' })
  rolePermissions: RolePermission[];

  @OneToMany(
    () => UserOrganizationRole,
    (userOrganizationRole) => userOrganizationRole.role,
  )
  @JoinColumn({ name: 'id' })
  userOrganizationRoles: UserOrganizationRole[];

  belongsToOrg(orgId: number): boolean {
    if (this.organizationId === 0) return true; // system role
    return this.organizationId === orgId;
  }
}
