import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';

import { AppValidationPipe } from '../app.validation.pipe';
import { UsersService } from './users.service';
import { UserDto } from 'src/dto/user.dto';
import { SignInDto } from 'src/dto/signin.dto';

@UsePipes(new AppValidationPipe())
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  public signUp(@Body() body: UserDto): Promise<{ token: string }> {
    return this.usersService.signUp(body);
  }

  @Post('signin')
  public signIn(@Body() body: SignInDto): Promise<{ token: string }> {
    return this.usersService.signIn(body);
  }
}
