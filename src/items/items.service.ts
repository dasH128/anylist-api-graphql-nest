import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput): Promise<Item> {
    const newItem = await this.itemRepository.save(createItemInput);
    return await this.itemRepository.save(newItem);
  }

  async findAll(): Promise<Item[]> {
    var items = await this.itemRepository.find();

    return items;
  }

  async findOne(id: string): Promise<Item> {
    var item = await this.itemRepository.findOneBy({ id });
    if (!item) throw new NotFoundException(`Item wtih id ${id} not found`);

    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {
    // var x = await this.itemRepository.update(id, updateItemInput);
    var item = await this.itemRepository.preload(updateItemInput);
    if (!item) throw new NotFoundException(`Item wtih id ${id} not found`);

    return await this.itemRepository.save(item);
  }

  async remove(id: string): Promise<Item> {
    const item = await this.findOne(id);

    await this.itemRepository.remove(item);
    return { ...item, id };
  }
}
