import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'password only accepts english and number',
  })
  password: string;

  @IsString()
  @MinLength(4)
  @MaxLength(10)
  @Matches(/^[a-zA-Zㄱ-ㅎ가-힣]/, {
    message: 'nickname only accepts korean and english',
  })
  nickname: string;
}
