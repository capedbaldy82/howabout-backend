import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './auth.repository';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { AuthSignInDto } from './dto/auth-signin.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { AuthCheckIdDto } from './dto/auth-checkid.dto';
import { ProductRepository } from 'src/product/product.repository';

@Injectable()
export class AuthService {
  private logger = new Logger('Auth');

  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private productRepository: ProductRepository,
    private jwtService: JwtService,
  ) {}

  // 회원가입
  signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    return this.userRepository.createUser(authCredentialsDto);
  }

  // 로그인
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

  // 아이디 중복 확인
  async checkId(authCheckIdDto: AuthCheckIdDto): Promise<{ ok: boolean }> {
    const { username } = authCheckIdDto;

    const user = await this.userRepository.findOneBy({ username });

    if (user) {
      return { ok: false };
    } else {
      return { ok: true };
    }
  }

  // 장바구니 상품 추가
  async addProductInCart(user: User, productId: number) {
    const { username } = user;

    const product = await this.productRepository.findOneBy({
      id: productId,
    });

    return product;
  }

  // 장바구니 상품 삭제

  // 장바구니 상품 조회
}
