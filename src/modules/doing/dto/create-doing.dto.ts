import { IsOptional, IsString, Length, MaxLength } from 'class-validator';
import { ApiBody, ApiProperty } from '@nestjs/swagger';

export class CreateDoingDto {
  @IsString()
  @Length(3, 60)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description: string;
}
