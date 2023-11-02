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
import * as bcrypt from 'bcrypt';
import { LoginResponse } from './dto/login-response.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';

interface JwtToken {
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async login(loginRequest: LoginRequestDto): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmailWithOrganizationsAndRoles(
      loginRequest.email,
    );

    if (!user) {
      throw new NotFoundException(
        'We could not find any user with that email!',
      );
    }

    const isMatch = await bcrypt.compare(loginRequest.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Wrong password for this account');
    }

    const { accessToken } = this.generateToken(user);
    const userProfile = new ProfileResponseDto(user);

    return {
      accessToken,
      userData: userProfile,
    };
  }

  async register(
    registerRequest: RegisterRequestDto,
  ): Promise<RegisterResponse> {
    const existedUser = await this.userRepository.findByEmail(
      registerRequest.email,
    );

    if (existedUser) {
      throw new BadRequestException('An user with that email already exists!');
    }

    // Hash password before save into DB
    const saltOrRounds = 10;

    const user = new User();
    user.email = registerRequest.email;
    user.name = registerRequest.name;
    user.password = await bcrypt.hash(registerRequest.password, saltOrRounds);

    await user.save();

    return user;
  }

  private generateToken(user: User): JwtToken {
    const payload = { sub: user.id, email: user.email };
    // NOTE: If client need to decrypt this JWT, it is better to encrypt the payload using
    // public/private key pair instead of symmetric secret key.
    // See: https://docs.nestjs.com/techniques/authentication#implementing-passport-jwt
    return { accessToken: this.jwtService.sign(payload) };
  }
}
