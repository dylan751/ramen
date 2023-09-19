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
import { PermissionObject } from './permission-object.entity';
import { RolePermission } from './role-permission.entity';

export enum PermissionAction {
  MANAGE = 'manage',
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
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

  @Column()
  @IsNotEmpty()
  permissionObjectId: number;

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

  @ManyToOne(
    () => PermissionObject,
    (permissionObject) => permissionObject.permissions,
  )
  @JoinColumn({ name: 'permissionObjectId' })
  permissionObject: PermissionObject;
}
