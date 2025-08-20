import { Exclude } from 'class-transformer';
import { Category } from 'src/categories/entities/categories.entity';
import { Transaction } from 'src/transactions/entities/transactions.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Users')
export class Auth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  transactions: Transaction[];

  @OneToMany(() => Category, (category) => category.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  categories: Category[];
}
