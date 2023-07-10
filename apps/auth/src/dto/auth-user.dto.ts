import { IsEmail, IsStrongPassword } from 'class-validator';

export class AuthUserDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
