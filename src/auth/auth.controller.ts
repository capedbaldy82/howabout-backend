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
    return user;
  }
}
