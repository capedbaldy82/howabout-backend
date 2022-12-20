import { Product } from 'src/product/product.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column({ default: 0 })
  token: number;

  @Column({ default: 'none' })
  tier: string;

  @Column('date', { array: true })
  subscribe: Date[];

  @Column('int', { array: true })
  cart: number[];

  @Column('int', { array: true })
  rent: number[];

  @Column('int', { array: true })
  rented: number[];

  // @OneToMany((type) => Product, (product) => product.user, { eager: true })
  // array: Product[];
}
