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

  @Column({ nullable: true })
  tier: string;

  @Column({ nullable: true })
  apply: string;

  @Column('date', { array: true, nullable: true })
  subscribe: Date[];

  @Column('int', { array: true, nullable: true })
  cart: number[];

  @Column('int', { array: true, nullable: true })
  order: number[];

  @Column('int', { array: true, nullable: true })
  rent: number[];

  @Column('int', { array: true, nullable: true })
  rented: number[];

  // @OneToMany((type) => Product, (product) => product.user, { eager: true })
  // array: Product[];
}
