import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { PaginationArg, SearchArg } from 'src/common/dtos/args';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const newItem = await this.itemRepository.create({
      ...createItemInput,
      user: user,
    });
    return await this.itemRepository.save(newItem);
  }

  async findAll(
    user: User,
    paginationArg: PaginationArg,
    searchArg: SearchArg,
  ): Promise<Item[]> {
    const { limit, offset } = paginationArg;
    const { search } = searchArg;
    // var items = await this.itemRepository.find({
    //   where: {
    //     user: { id: user.id },
    //     name: Like(`%${search}%`),
    //   },
    //   take: limit,
    //   skip: offset,
    // });
    // return items;

    const queryBuilder = this.itemRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"userId" = :userId`, { userId: user.id });

    if (search) {
      queryBuilder.andWhere('LOWER(name) like :name', {
        name: `%${search.toLowerCase()}%`,
      });
    }
    return await queryBuilder.getMany();
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
