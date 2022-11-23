import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './auth.repository';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { AuthSignInDto } from './dto/auth-signin.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { AuthCheckIdDto } from './dto/auth-checkid.dto';

@Injectable()
export class AuthService {
  private logger = new Logger('Auth');

  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    return this.userRepository.createUser(authCredentialsDto);
  }

  async signIn(authSignInDto: AuthSignInDto): Promise<SignInReturn> {
    const { username, password } = authSignInDto;
    const user = await this.userRepository.findOneBy({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { username };
      const accessToken = await this.jwtService.sign(payload);
      this.logger.verbose(`[${username}] has logged in`);

      return { ok: true, accessToken, name: user.name };
    } else {
      throw new UnauthorizedException('login failed');
    }
  }

  async checkId(authCheckIdDto: AuthCheckIdDto): Promise<{ ok: boolean }> {
    const { username } = authCheckIdDto;

    const user = await this.userRepository.findOneBy({ username });

    if (user) {
      return { ok: false };
    } else {
      return { ok: true };
    }
  }

  async getFileUploadURL() {
    const response = await (
      await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ID}/images/v2/direct_upload`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.CF_TOKEN}`,
          },
        },
      )
    ).json();

    console.log(response);

    return { ok: true, ...response.result };
  }
}
