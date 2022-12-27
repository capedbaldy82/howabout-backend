import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './auth.repository';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { AuthSignInDto } from './dto/auth-signin.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { AuthCheckIdDto } from './dto/auth-checkid.dto';
import { ProductRepository } from 'src/product/product.repository';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class AuthService {
  private logger = new Logger('Auth');

  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    private productRepository: ProductRepository,
    private jwtService: JwtService,
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
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

  // 유저 정보 확인
  getUserInfo(user: User) {
    const userinfo = {
      ...user,
      password: '',
    };

    return userinfo;
  }

  async getUserInfoById(user: User, id: number) {
    if (user.username !== 'admin') {
      throw new UnauthorizedException('잘못된 접근입니다.');
    }

    const selectedUser = await this.userRepository.findOneBy({ id });

    if (!selectedUser) {
      throw new NotFoundException(`존재하지 않는 유저입니다..`);
    }

    delete selectedUser.password;

    return { ok: true, user: selectedUser };
  }

  // 모든 유저 정보 확인
  async getAllUserInfo(user: User) {
    if (user.username !== 'admin') {
      throw new UnauthorizedException('잘못된 접근입니다.');
    }

    const allusers = await this.userRepository.find();

    const filteredUsers = allusers.map((user) => {
      delete user.password;
      return user;
    });

    return { ok: true, users: filteredUsers };
  }

  /*        */
  /* 장바구니 */
  /*        */

  // 장바구니 상품 추가
  async addProductInCart(user: User, productId: number) {
    const { id, cart } = user;

    if (cart.indexOf(productId) !== -1) {
      return {
        ok: false,
        message: '해당 상품은 이미 장바구니에 존재합니다.',
      };
    }

    const result = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ cart: [...cart, productId] })
      .where('id = :id', { id })
      .execute();

    const product = await this.productRepository.findOneBy({ id: productId });

    return result.affected ? { ok: true, product } : { ok: false };
  }

  // 장바구니 상품 삭제
  async deleteProductInCart(user: User, productId: number) {
    const { id, cart } = user;

    const isExist = cart.indexOf(productId);

    if (isExist === -1) {
      return {
        ok: false,
        message: '해당 상품은 이미 장바구니에 없습니다.',
      };
    }
    cart.splice(isExist, 1);

    const result = await this.userRepository.update(id, {
      ...user,
      cart,
    });

    return result.affected ? { ok: true } : { ok: false };
  }

  // 장바구니 상품 조회
  async getCart(user: User) {
    const { username } = user;
    const productArray = [];

    const { cart } = await this.userRepository.findOneBy({ username });

    for (let productId of cart) {
      const product = await this.productRepository.findOneBy({ id: productId });
      productArray.push(product);
    }

    return { cart: productArray };
  }

  // 장바구니 주문하기
  async orderProduct(user: User, product: number[]) {
    const { id } = user;

    await this.userRepository.update(id, {
      cart: [],
      order: product,
    });
  }

  // 주문 취소하기
  async cancleProduct(user: User) {
    const { id } = user;

    const beforeUser = await this.userRepository.findOneBy({ id });

    await this.userRepository.update(id, {
      cart: beforeUser.order,
      order: [],
    });
  }

  // admin - 상품 승인
  async approveProduct(user: User, applicant: number, product: number[]) {
    const { username } = user;

    if (username !== 'admin') {
      return { ok: false, message: '올바른 접근이 아닙니다.' };
    }

    const updateUser = await this.userRepository.update(applicant, {
      order: [],
      rent: product,
    });

    if (updateUser.affected === 0) {
      return { ok: false, message: '업데이트에 실패했습니다.' };
    }

    return { ok: true, message: '주문이 정상 승인 되었습니다.' };
  }

  // admin - 상품 거절
  async denyProduct(user: User, applicant: number, product: number[]) {
    const { username } = user;

    if (username !== 'admin') {
      return { ok: false, message: '올바른 접근이 아닙니다.' };
    }

    const updateUser = await this.userRepository.update(applicant, {
      order: [],
      cart: product,
    });

    if (updateUser.affected === 0) {
      return { ok: false, message: '업데이트에 실패했습니다.' };
    }

    return { ok: true, message: '주문이 정상 거부 되었습니다.' };
  }

  // 구독 신청
  async applySubscribe(user: User, tier: string) {
    const { id } = user;

    const applyedUser = await this.userRepository.update(id, {
      apply: tier,
    });

    const updatedUser = await this.userRepository.findOneBy({ id });

    return {
      ok: true,
      user: { name: updatedUser.name, apply: updatedUser.apply },
    };
  }

  // 구독 신청 취소
  async cancleSubscribe(user: User) {
    const { id } = user;

    const applyedUser = await this.userRepository.update(id, {
      apply: '취소',
    });

    const updatedUser = await this.userRepository.findOneBy({ id });

    return {
      ok: true,
      user: { name: updatedUser.name, apply: updatedUser.apply },
    };
  }

  // admin - 구독 승인
  async approveSubscribe(user: User, applicant: number, tier: string) {
    const { username } = user;

    if (username !== 'admin') {
      return { ok: false, message: '올바른 접근이 아닙니다.' };
    }

    let token = 0;

    switch (tier) {
      case 'basic':
        token = 3;
        break;
      case 'standard':
        token = 5;
        break;
      case 'premium':
        token = 8;
        break;
      default:
        token = 0;
        break;
    }

    if (!token) {
      return { ok: false, message: '잘못된 요청입니다.' };
    }

    const updateUser = await this.userRepository.update(applicant, {
      tier,
      token,
      apply: '',
    });

    const affectedUser = await this.userRepository.findOneBy({ id: applicant });

    return {
      ok: true,
      user: {
        name: affectedUser.name,
        tier: affectedUser.tier,
        token: affectedUser.token,
      },
    };
  }

  // admin - 구독 거절
  async denySubscribe(user: User, applicant: number) {
    const { username } = user;

    if (username !== 'admin') {
      return { ok: false, message: '올바른 접근이 아닙니다.' };
    }

    const updatedUser = await this.userRepository.update(applicant, {
      apply: '거절',
    });

    const affectedUser = await this.userRepository.findOneBy({ id: applicant });

    return { ok: true, user: { name: affectedUser } };
  }
}
