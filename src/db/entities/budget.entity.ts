import { IsNumber } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { Category } from './category.entity';

@Entity('budgets')
export class Budget extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNumber()
  organizationId: number;

  @Column()
  @IsNumber()
  projectId: number;

  @Column()
  @IsNumber()
  categoryId: number;

  @Column()
  @IsNumber()
  amount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Project, (project) => project.budgets)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @OneToOne(() => Category, (category) => category.budget)
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'id' })
  category: Category;
}
