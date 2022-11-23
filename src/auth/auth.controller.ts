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

  @Post('/checkid')
  checkId(@Body() authCheckIdDto: AuthCheckIdDto): Promise<{ ok: boolean }> {
    return this.authService.checkId(authCheckIdDto);
  }

  @Get('/check')
  @UseGuards(AuthGuard())
  checkUser(): { ok: boolean } {
    return { ok: true };
  }

  @Get('/fileurl')
  @UseGuards(AuthGuard())
  getFileUploadURL(): Promise<{ ok: boolean; [key: string]: any }> {
    return this.authService.getFileUploadURL();
  }
}
