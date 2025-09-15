import {
  BadRequestException,
  Body,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserInterface } from '@repo/dbschema';
import { Repository } from 'typeorm';
import type { CreateUserDto } from '../DTO/users.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async createUser(@Body() input: CreateUserDto): Promise<UserInterface> {
    console.log('in service', input);
    try {
      const email = input.email;
      const user = await this.userRepo.findOneBy({ email });

      if (user) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'Email already exists',
        });
      }
      if (input.password.length <= 8) {
        throw new BadRequestException(
          'password must be more than 8 characters',
        );
      }
      try {
        const passwordhash = await bcrypt.hash(input.password, 10);
        const newUser = await this.userRepo.save({
          name: input.name,
          password: passwordhash,
          email: email,
        });
        return newUser;
      } catch {
        throw new InternalServerErrorException('cannot create hash');
      }
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnprocessableEntityException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Unexpected error occurred');
    }
  }
}
