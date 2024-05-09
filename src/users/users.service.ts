import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { SignupInput } from 'src/auth/dto/inputs/signup.input';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(sigupInput: SignupInput): Promise<User> {
    try {
      let user = this.userRepository.create({
        ...sigupInput,
        password: bcrypt.hashSync(sigupInput.password, 10),
      });
      console.log(user);
      return await this.userRepository.save(user);
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findAll(): Promise<User[]> {
    return [];
  }

  async findOne(id: string): Promise<User> {
    let user = new User();
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ email });
    } catch (error) {
      console.table(error);
      throw new NotFoundException(`${email} not found`);
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ id });
    } catch (error) {
      console.table(error);
      throw new NotFoundException(`${id} not found`);
    }
  }

  async block(id: string): Promise<User> {
    throw new Error('block not implement');
  }

  private handleDBError(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail.replace('Key', ''));
    }
    this.logger.error(error);

    throw new InternalServerErrorException('Please check server logs');
  }
}
