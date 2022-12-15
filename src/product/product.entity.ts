import { User } from 'src/auth/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column()
  type: string;

  @Column()
  image: string;

  @Column()
  status: boolean;

  @Column()
  until: string;

  @Column()
  rank: number;

  @Column()
  description: string;

  // @ManyToOne((type) => User, (user) => user.cart, { eager: false })
  // user: User;
}
