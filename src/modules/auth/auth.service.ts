import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginRequestDto } from './dto/login-request.dto';
import { UserRepository } from 'src/db/repositories';
import { User } from 'src/db/entities';
import { JwtService } from '@nestjs/jwt';
import { RegisterRequestDto } from './dto/register-request.dto';
import { RegisterResponse } from './dto/register-response.dto';

interface JwtToken {
  token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async login(loginRequest: LoginRequestDto): Promise<JwtToken> {
    // TODO: Add error handling
    const user = await this.userRepository.findByEmail(loginRequest.email);

    if (!user) {
      throw new NotFoundException(
        'We could not find any user with that email!',
      );
    }

    if (user.password !== loginRequest.password) {
      throw new UnauthorizedException('Wrong password for this account');
    }

    return this.generateToken(user);
  }

  async register(
    registerRequest: RegisterRequestDto,
  ): Promise<RegisterResponse> {
    // TODO: Add error handling
    const existedUser = await this.userRepository.findByEmail(
      registerRequest.email,
    );

    if (existedUser) {
      throw new BadRequestException('An user with that email already exists!');
    }

    // TODO: Hash password before save into DB
    const user = new User();
    user.email = registerRequest.email;
    user.name = registerRequest.name;
    user.password = registerRequest.password;

    await user.save();

    return user;
  }

  private generateToken(user: User): JwtToken {
    const payload = { sub: user.id, email: user.email };
    // NOTE: If client need to decrypt this JWT, it is better to encrypt the payload using
    // public/private key pair instead of symmetric secret key.
    // See: https://docs.nestjs.com/techniques/authentication#implementing-passport-jwt
    return { token: this.jwtService.sign(payload) };
  }
}
