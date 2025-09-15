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
import type { CreateUserDto, UpdateUserDto } from '../DTO/users.dto';
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

  async updateUser(id: number, updateInfo: UpdateUserDto): Promise<string> {
    try {
      const needtoUpdateUser: Partial<User> = {};
      const dbUser = await this.userRepo.findOneBy({ id });
      if (!dbUser) {
        throw new BadRequestException('User not found');
      }

      if (updateInfo.password) {
        const oldPasswordCheck = await bcrypt.compare(
          updateInfo.password,
          dbUser?.password,
        );

        if (oldPasswordCheck) {
          throw new BadRequestException(
            'New password must be different from the old one',
          );
        }
        const newPassword = await bcrypt.hash(updateInfo.password, 10);
        needtoUpdateUser.password = newPassword;
      }
      if (updateInfo.email && updateInfo.email !== dbUser?.email) {
        const emailFindUser = await this.userRepo.findOneBy({
          email: updateInfo.email,
        });
        if (emailFindUser?.email && emailFindUser.id !== id) {
          throw new BadRequestException('email id exists');
        }
        needtoUpdateUser.email = updateInfo.email;
      }
      if (updateInfo.name && updateInfo.name !== dbUser?.name) {
        needtoUpdateUser.name = updateInfo.name;
      }
      if (Object.keys(needtoUpdateUser).length == 0) {
        throw new BadRequestException('No changes provided');
      }
      const updatedUser = await this.userRepo.update(id, needtoUpdateUser);
      console.log(updatedUser);
      return 'user updated';
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Unexpected error occured');
    }
  }
}
