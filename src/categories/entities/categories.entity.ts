import { Auth } from 'src/auth/entities/auth.entity';
import { Transaction } from 'src/transactions/entities/transactions.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'userId', type: 'uuid' })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Auth, (user) => user.categories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Auth;

  @OneToMany(() => Transaction, (transaction) => transaction.category, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  transactions: Transaction[];
}
