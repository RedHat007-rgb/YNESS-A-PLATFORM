import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UserInterface } from '@repo/dbschema';
import type { CreateUserDto, UpdateUserDto } from 'src/DTO/users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Post('/create')
  async createUsers(@Body() input: CreateUserDto): Promise<UserInterface> {
    console.log(input);
    return this.userService.createUser(input);
  }
  @Patch('/update/:id')
  updateUsers(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInfo: UpdateUserDto,
  ) {
    console.log(id);
    console.log(updateInfo);
    return this.userService.updateUser(id, updateInfo);
  }
}
