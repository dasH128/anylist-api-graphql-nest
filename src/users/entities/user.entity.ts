import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
