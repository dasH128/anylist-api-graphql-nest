import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthResponse } from './types/auth-response.type';
import { SignupInput, LoginInput } from './dto/inputs';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private getJwtToken(userId: string) {
    return this.jwtService.sign({ id: userId });
  }

  async signUp(signupInput: SignupInput): Promise<AuthResponse> {
    const user = await this.usersService.create(signupInput);

    // TODO crear token
    const token = this.getJwtToken(user.id);

    return { token, user };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const { email, password } = loginInput;
    const user = await this.usersService.findOneByEmail(email);

    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Email/Password do not match');
    }

    // TODO crear token
    const token = this.getJwtToken(user.id);

    return { token, user };
  }

  revalidateToken(user: User): AuthResponse {
    const token = this.getJwtToken(user.id);

    return {
      user,
      token,
    };
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.usersService.findOneById(userId);

    if (!user.isActive) {
      throw new UnauthorizedException('User is inactive, talk with an admin');
    }

    delete user.password;
    return user;
  }
}
