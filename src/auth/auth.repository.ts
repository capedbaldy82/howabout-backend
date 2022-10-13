import { CustomRepository } from 'src/libs/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { username, password, name, phone, address } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.create({
      username,
      password: hashedPassword,
      name,
      phone,
      address,
    });

    try {
      await this.save(user);

      return user;
    } catch (error) {
      console.log(`Error: ${error}`);

      if (error.code === '23505') {
        throw new ConflictException('Already Existing username');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
