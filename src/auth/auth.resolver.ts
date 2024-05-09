import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput, LoginInput } from './dto/inputs';
import { AuthResponse } from './types/auth-response.type';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-ayth.guard';
import { User } from 'src/users/entities/user.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { ValidRoles } from './enums/valid-roles.enum';

@Resolver(() => AuthResponse)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, { name: 'signUp' })
  async signUp(
    @Args('signupInput') signupInput: SignupInput,
  ): Promise<AuthResponse> {
    return this.authService.signUp(signupInput);
  }

  @Mutation(() => AuthResponse, { name: 'login' })
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }

  @Query(() => AuthResponse, { name: 'revalite' })
  @UseGuards(JwtAuthGuard)
  revalidateToken(
    @CurrentUser(/** [ValidRoles.user] **/) user: User,
  ): AuthResponse {
    return this.authService.revalidateToken(user);
  }
}
