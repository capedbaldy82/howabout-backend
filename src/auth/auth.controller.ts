import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCheckIdDto } from './dto/auth-checkid.dto';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { AuthSignInDto } from './dto/auth-signin.dto';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<User> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIn(@Body() authSignInDto: AuthSignInDto): Promise<SignInReturn> {
    return this.authService.signIn(authSignInDto);
  }

  // 아이디 중복 확인
  @Post('/checkid')
  checkId(@Body() authCheckIdDto: AuthCheckIdDto): Promise<{ ok: boolean }> {
    return this.authService.checkId(authCheckIdDto);
  }

  // 유저 인증
  @Get('/check')
  @UseGuards(AuthGuard())
  checkUser(): { ok: boolean } {
    return { ok: true };
  }

  // 유저 정보 확인
  @Get('/userinfo')
  @UseGuards(AuthGuard())
  getUserInfo(@GetUser() user: User) {
    const userinfo = {
      id: user.username,
      name: user.name,
      phone: user.phone,
      address: user.address,
    };
    return userinfo;
  }

  // 장바구니 추가
  @Post('/cart')
  @UseGuards(AuthGuard())
  addProductInCart(
    @GetUser() user: User,
    @Body('productId') productId: number,
  ) {
    return this.authService.addProductInCart(user, productId);
  }

  // 장바구니 삭제
  @Post('/cart/delete')
  @UseGuards(AuthGuard())
  deleteProductInCart(
    @GetUser() user: User,
    @Body('productId') productId: number,
  ) {
    return this.authService.deleteProductInCart(user, productId);
  }

  // 장바구니 조회
  @Get('/cart')
  @UseGuards(AuthGuard())
  getCart(@GetUser() user: User) {
    return this.authService.getCart(user);
  }

  // 신청하기 in 장바구니
  @Post('/order')
  @UseGuards(AuthGuard())
  orderProduct(@GetUser() user: User, @Body('product') product: number[]) {
    return this.authService.orderProduct(user, product);
  }

  // 취소하기 in 장바구니
  @Post('/cancle')
  @UseGuards(AuthGuard())
  cancleProduct(@GetUser() user: User) {
    return this.authService.cancleProduct(user);
  }

  // admin - 주문 승인
  @Post('/approve')
  @UseGuards(AuthGuard())
  approveProduct(
    @GetUser() user: User,
    @Body('applicant') applicant: number,
    @Body('product') product: number[],
  ) {
    return this.authService.approveProduct(user, applicant, product);
  }

  // admin - 주문 거절
  @Post('/deny')
  @UseGuards(AuthGuard())
  denyProduct(
    @GetUser() user: User,
    @Body('applicant') applicant: number,
    @Body('product') product: number[],
  ) {
    return this.authService.denyProduct(user, applicant, product);
  }

  // 구독 신청
  @Post('/subscribe/apply')
  @UseGuards(AuthGuard())
  applySubscribe(@GetUser() user: User, @Body('rank') rank: string) {
    return this.authService.applySubscribe(user, rank);
  }

  // 구독 신청 취소
  @Post('/subscribe/cancle')
  @UseGuards(AuthGuard())
  cancleSubscribe(@GetUser() user: User, @Body('tier') tier: string) {
    return this.authService.cancleSubscribe(user);
  }

  // admin - 구독 승인
  @Post('/subscribe/approve')
  @UseGuards(AuthGuard())
  approveSubscribe(
    @GetUser() user: User,
    @Body('applicant') applicant: number,
    @Body('tier') tier: string,
  ) {
    return this.authService.approveSubscribe(user, applicant, tier);
  }

  // admin - 구독 거절
  @Post('/subscribe/deny')
  @UseGuards(AuthGuard())
  denySubscribe(@GetUser() user: User, @Body('applicant') applicant: number) {
    return this.authService.denySubscribe(user, applicant);
  }
}
