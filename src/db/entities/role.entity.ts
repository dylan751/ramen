import { IsNotEmpty } from 'class-validator';
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
import { RolePermission } from './role-permission.entity';
import { User } from './user.entity';
import { Organization } from './organization.entity';

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

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  @JoinColumn({ name: 'id' })
  rolePermissions: RolePermission[];

  @ManyToOne(() => Organization, (organization) => organization.roles)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @OneToMany(() => User, (user) => user.role)
  @JoinColumn({ name: 'id' })
  users: User[];
}
