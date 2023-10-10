import { IsNotEmpty } from 'class-validator';
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

export enum PermissionAction {
  MANAGE = 'manage',
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum PermissionObject {
  ALL = 'all',
  ORGANIZATION = 'organization',
  USER = 'user',
  ROLE = 'role',
}

@Entity('permissions')
export class Permission extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: PermissionAction,
  })
  @IsNotEmpty()
  action: PermissionAction;

  @Column({
    type: 'enum',
    enum: PermissionObject,
  })
  @IsNotEmpty()
  object: PermissionObject;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => RolePermission,
    (rolePermission) => rolePermission.permission,
  )
  @JoinColumn({ name: 'id' })
  rolePermissions: RolePermission[];
}
