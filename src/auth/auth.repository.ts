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
  async createUser(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ nickname: string }> {
    const { username, password, nickname } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.create({ username, password: hashedPassword, nickname });

    try {
      await this.save(user);

      return { nickname: nickname };
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
