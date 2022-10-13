import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^[A-za-z0-9]{4,20}$/, {
    message: '4~20 length, english or number',
  })
  username: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^(?=.*[a-zA-z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/, {
    message: '8~20 length, english and number and specials',
  })
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(10)
  @Matches(/[a-zA-z0-9가-힣]{2,10}$/, {
    message: '2~10 length, korean or english or number',
  })
  name: string;

  @IsString()
  @MinLength(11)
  @MaxLength(11)
  @Matches(/([0-9]{11})/, {
    message: '11 length, number',
  })
  phone: string;

  @IsString()
  address: string;
}
