import { IsOptional } from 'class-validator';
import { Auth } from 'src/auth/entities/auth.entity';
import { Category } from 'src/categories/entities/categories.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  @IsOptional()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: ['income', 'expense'] })
  type: 'income' | 'expense';

  @Column({ name: 'categoryId', type: 'uuid', nullable: true })
  @IsOptional()
  categoryId: string;

  @Column()
  transactionDate: Date;

  @Column({ name: 'userId', type: 'uuid' })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Auth, (user) => user.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Auth;

  @ManyToOne(() => Category, (category) => category.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}
