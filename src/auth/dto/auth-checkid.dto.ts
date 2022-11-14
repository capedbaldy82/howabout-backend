import { IsString, Matches } from 'class-validator';

export class AuthCheckIdDto {
  @IsString()
  @Matches(/^[A-za-z0-9]{4,20}$/, {
    message: '4~20 length, english or number',
  })
  username: string;
}
