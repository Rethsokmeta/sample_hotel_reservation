import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authUserDto: AuthUserDto) {
    return this.authService.signUp(authUserDto);
  }

  @Post('/signin')
  signIn(@Body() authUserDto: AuthUserDto) {
    return this.authService.signIn(authUserDto);
  }

  @MessagePattern({ cmd: 'authenticate' })
  async authenticate(@Payload() data: any) {
    const res = this.authService.validateUser(data);
    console.log('res', res);
    return res;
  }
}
