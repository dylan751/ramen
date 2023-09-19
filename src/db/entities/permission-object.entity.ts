import { IsNotEmpty } from 'class-validator';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from './permission.entity';

export enum PermissionSubject {
  ALL = 'ALL',
  ORGANIZATION = 'Organization',
  PEOPLE = 'People',
  ACCOUNT = 'Account',
  USER = 'User',
  ROLE = 'Role',
}

@Entity('permission_objects')
export class PermissionObject extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  name: PermissionSubject;

  //   @OneToMany(() => Permission, (permission) => permission.permissionObject)
  //   @JoinColumn({ name: 'id' })
  //   permissions: Permission[];
}
