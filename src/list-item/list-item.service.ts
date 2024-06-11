import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListItem } from './entities/list-item.entity';
import { List } from 'src/lists/entities/list.entity';
import { PaginationArg, SearchArg } from 'src/common/dtos/args';

@Injectable()
export class ListItemService {
  constructor(
    @InjectRepository(ListItem)
    private readonly repositoryListItem: Repository<ListItem>,
  ) {}

  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {
    const { itemId, listId, ...rest } = createListItemInput;
    const newListItem = this.repositoryListItem.create({
      ...rest,
      item: { id: itemId },
      list: { id: listId },
    });
    await this.repositoryListItem.save(newListItem);
    return this.findOne(newListItem.id);
  }

  async findAll(
    list: List,
    paginationArg: PaginationArg,
    searchArg: SearchArg,
  ): Promise<ListItem[]> {
    const { limit, offset } = paginationArg;
    const { search } = searchArg;

    const queryBuilder = this.repositoryListItem
      .createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"listId" = :listId`, { listId: list.id });

    if (search) {
      queryBuilder.andWhere('LOWER(item.name) like :name', {
        name: `%${search.toLowerCase()}%`,
      });
    }
    return await queryBuilder.getMany();
  }

  async countListItemByList(list: List): Promise<number> {
    return await this.repositoryListItem.count({
      where: { list: { id: list.id } },
    });
  }

  async findOne(id: string): Promise<ListItem> {
    const listItem = await this.repositoryListItem.findOneBy({ id });

    if (!listItem) {
      throw new NotFoundException(`ListItem with id ${id} not found`);
    }

    return listItem;
  }

  async update(
    id: string,
    updateListItemInput: UpdateListItemInput,
  ): Promise<ListItem> {
    const { listId, itemId, ...rest } = updateListItemInput;

    // const listItem = await this.repositoryListItem.preload({
    //   ...rest,
    //   list: { id: listId },
    //   item: { id: itemId },
    // });

    // if (!listItem) {
    //   throw new NotFoundException(`ListItem with id ${id} not found`);
    // }

    // return await this.repositoryListItem.save(listItem);

    const queryBuilder = this.repositoryListItem
      .createQueryBuilder()
      .update()
      .set(rest)
      .where('id = :id', { id });

    if (listId) queryBuilder.set({ list: { id: listId } });
    if (itemId) queryBuilder.set({ item: { id: itemId } });

    await queryBuilder.execute();

    return this.findOne(id);
  }

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  }
}
