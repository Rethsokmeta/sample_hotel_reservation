import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';
import { AUTH_SERVICE } from '../constants';
import { UserDto } from '../dto/user.dto';
import { isBoolean } from 'class-validator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authToken = request.headers.authorization;
    const result = await this.authClient
      .send<UserDto>({ cmd: 'authenticate' }, authToken)
      .pipe(
        map((res) => {
          if (isBoolean(res) && res === false) {
            return false;
          }
          context.switchToHttp().getRequest().user = res;
          return true;
        }),
      )
      .toPromise();
    console.log(result);
    return result;
  }
}
