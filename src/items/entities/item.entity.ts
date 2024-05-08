import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
@ObjectType()
export class Item {
  @Field(() => ID, { description: 'ID identifier of Item' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String, { description: 'name of Item' })
  @Column()
  name: string;

  @Field(() => Float, { description: 'quantity of Item' })
  @Column()
  quantity: number;

  @Field(() => String, { description: 'quantityUnits of Item', nullable: true })
  @Column({ nullable: true })
  quantityUnits?: string;
}
