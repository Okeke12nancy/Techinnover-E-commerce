import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column()
  description: string;

  @Column('int')
  quantity: number;

  @Column({ default: false })
  approved: boolean;

  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn()
  user: User;
}
