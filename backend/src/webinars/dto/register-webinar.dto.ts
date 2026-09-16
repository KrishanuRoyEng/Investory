import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterWebinarDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;
}
