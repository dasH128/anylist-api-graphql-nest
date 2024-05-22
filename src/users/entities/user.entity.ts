import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Item } from 'src/items/entities/item.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column('text')
  fullName: string;

  @Field(() => String)
  @Column('text', { unique: true })
  email: string;

  // @Field(() => String)
  @Column('text')
  password: string;

  @Field(() => [String])
  @Column('text', { array: true, default: ['user'] })
  roles: string[];

  @Field(() => Boolean)
  @Column('bool', { default: true })
  isActive: boolean;

  // TODO: relaciones

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.lastUpdateBy, {
    nullable: true,
    lazy: true,
  })
  @JoinColumn({ name: 'lastUpdateBy' })
  lastUpdateBy?: User;

  // @Field(() => [Item])
  @OneToMany(() => Item, (item) => item.user, { lazy: true })
  items: Item[];
}
