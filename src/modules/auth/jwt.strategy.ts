import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/db/entities';
import { InvalidAccessTokenException } from '../common/exceptions/base.exception';
import { UsersService } from 'src/modules/organizations/users/users.service';

interface JwtPayload {
  sub: number;
  email?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.usersService.findByIdWithOrganizations(payload.sub);
    if (!user) {
      throw new InvalidAccessTokenException('User not found');
    }

    return user;
  }
}
