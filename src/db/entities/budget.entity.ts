import { IsNumber } from 'class-validator';
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
import { Project } from './project.entity';
import { Category } from './category.entity';

@Entity('budgets')
export class Budget extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNumber()
  projectId: number;

  @Column()
  @IsNumber()
  categoryId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Project, (project) => project.budgets)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @ManyToOne(() => Category, (category) => category.budgets)
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}
