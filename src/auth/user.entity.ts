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

  @Column({ nullable: true })
  apply: string;

  @Column('date', { array: true, default: [] })
  subscribe: Date[];

  @Column('int', { array: true, default: [] })
  cart: number[];

  @Column('int', { array: true, default: [] })
  order: number[];

  @Column('int', { array: true, default: [] })
  rent: number[];

  @Column('int', { array: true, default: [] })
  rented: number[];

  // @OneToMany((type) => Product, (product) => product.user, { eager: true })
  // array: Product[];
}
