import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AuthUserDto } from './dto/auth-user.dto';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async signIn(authUserDto: AuthUserDto): Promise<{ accessToken: string }> {
    const { email, password } = authUserDto;
    const user = await this.userRepository.findOneBy({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email };
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new NotFoundException('Invalid Credential');
    }
  }

  async signUp(authUserDto: AuthUserDto) {
    const { email, password } = authUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
    });

    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        // duplicate username
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUser(data: any) {
    try {
      // Verify the token using the JWT service and the secret key
      const token = data.replace('Bearer ', '');
      const decodedToken = this.jwtService.verify(token);
      console.log(decodedToken);
      const user = await this.userRepository.findOneBy({
        email: decodedToken.email,
      });
      console.log(user);

      // If the token is successfully decoded, consider it valid
      if (user) {
        return user;
      }
      return false;
    } catch (error) {
      // If the token verification fails, return false
      console.log('no user');
      return false;
    }
  }
}
