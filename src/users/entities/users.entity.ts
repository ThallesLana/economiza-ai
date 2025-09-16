import { Category } from 'src/categories/entities/categories.entity';
import { UserStatus } from 'src/common/enums/user-status.enum';
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
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

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
