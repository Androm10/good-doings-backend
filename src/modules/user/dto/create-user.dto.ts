import { IsEmail, Length, MinLength } from 'class-validator';
import { ApiBody, ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsEmail()
  login: string;

  @Length(3, 60)
  password: string;

  @Length(3, 60)
  username: string;
}
