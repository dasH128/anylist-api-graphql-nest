import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { PaginationArg, SearchArg } from 'src/common/dtos/args';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
  ) {}

  async create(createListInput: CreateListInput, user: User): Promise<List> {
    const newList = this.listRepository.create({
      ...createListInput,
      user: user,
    });
    return await this.listRepository.save(newList);
  }

  async findAll(
    user: User,
    paginationArg: PaginationArg,
    searchArg: SearchArg,
  ): Promise<List[]> {
    const { limit, offset } = paginationArg;
    const { search } = searchArg;
    var queryBuilder = await this.listRepository
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

  async findOne(id: string, user: User): Promise<List> {
    var listBD = await this.listRepository.findOneBy({
      id: id,
      user: { id: user.id },
    });
    if (!listBD) throw new NotFoundException(`List with id ${id} not found`);
    return listBD;
  }

  async update(
    id: string,
    updateListInput: UpdateListInput,
    user: User,
  ): Promise<List> {
    await this.findOne(id, user);

    var list = await this.listRepository.preload({ ...updateListInput, user });
    if (!list) throw new NotFoundException(`List wtih id ${id} not found`);

    return await this.listRepository.save(list);
  }

  async remove(id: string, user: User): Promise<List> {
    const list = await this.findOne(id, user);

    await this.listRepository.remove(list);
    return { ...list, id };
  }

  async listCountByUser(user: User): Promise<number> {
    return await this.listRepository.count({
      where: {
        user: { id: user.id },
      },
    });
  }
}
