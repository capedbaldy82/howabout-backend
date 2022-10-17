import { IsString, Matches } from 'class-validator';

export class authSignInDto {
  @IsString()
  @Matches(/^[A-za-z0-9]{4,20}$/, {
    message: '4~20 length, english or number',
  })
  username: string;

  @IsString()
  @Matches(/^(?=.*[a-zA-z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/, {
    message: '8~20 length, english and number and specials',
  })
  password: string;
}
