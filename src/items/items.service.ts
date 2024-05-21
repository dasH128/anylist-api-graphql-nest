import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const newItem = await this.itemRepository.save({
      ...createItemInput,
      user: user,
    });
    return await this.itemRepository.save(newItem);
  }

  async findAll(user: User): Promise<Item[]> {
    var items = await this.itemRepository.find({
      where: { user: { id: user.id } },
    });
    return items;
  }

  async findOne(id: string, user: User): Promise<Item> {
    var item = await this.itemRepository.findOneBy({
      id,
      user: { id: user.id },
    });
    if (!item) throw new NotFoundException(`Item wtih id ${id} not found`);

    return item;
  }

  async update(
    id: string,
    updateItemInput: UpdateItemInput,
    user: User,
  ): Promise<Item> {
    await this.findOne(id, user);
    // var x = await this.itemRepository.update(id, updateItemInput);
    var item = await this.itemRepository.preload(updateItemInput);
    if (!item) throw new NotFoundException(`Item wtih id ${id} not found`);

    return await this.itemRepository.save(item);
  }

  async remove(id: string, user: User): Promise<Item> {
    const item = await this.findOne(id, user);

    await this.itemRepository.remove(item);
    return { ...item, id };
  }

  async itemCountByUser(user: User): Promise<number> {
    return await this.itemRepository.count({
      where: {
        user: { id: user.id },
      },
    });
  }
}
