import { IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  login: string;

  @IsOptional()
  @MinLength(3)
  @MaxLength(60)
  username: string;
}
