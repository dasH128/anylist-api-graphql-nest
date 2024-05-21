import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'items' })
@ObjectType()
export class Item {
  @Field(() => ID, { description: 'ID identifier of Item' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String, { description: 'name of Item' })
  @Column()
  name: string;

  // @Field(() => Float, { description: 'quantity of Item' })
  // @Column()
  // quantity: number;

  @Field(() => String, { description: 'quantityUnits of Item', nullable: true })
  @Column({ nullable: true })
  quantityUnits?: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.items, { nullable: false, lazy: true })
  @Index('userId-index')
  user: User;
}
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE0OGNjZDRmLWVhZGQtNDRiMy1hNDUyLTNhY2YwZTk0ZDM5YyIsImlhdCI6MTcxNjE5MzU3MSwiZXhwIjoxNzE2MjA3OTcxfQ.r_DJN6i7NceBQ83LC1r--eHYjZsNgGtf83xTAY2uFnU
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MjMwZjUzLTcxMDUtNDkwNy05Y2FhLTZlZThjOTk4NzcyMyIsImlhdCI6MTcxNjE5MzYwOCwiZXhwIjoxNzE2MjA4MDA4fQ.tuMi3TsQlAQl664h1AVmkvnyD3__amA9DPvvPOFOCtU
