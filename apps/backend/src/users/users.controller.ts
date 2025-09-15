import { Body, Controller, Post } from '@nestjs/common';
import { UserInterface } from '@repo/dbschema';
import type { CreateUserDto } from 'src/DTO/users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Post('/create')
  async createUsers(@Body() input: CreateUserDto): Promise<UserInterface> {
    console.log(input);
    return this.userService.createUser(input);
  }
}
