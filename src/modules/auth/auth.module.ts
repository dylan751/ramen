import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from 'src/db/repositories';
import { OrganizationUsersModule } from '../organizations/users/users.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    OrganizationUsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '86400s' }, // 1 day
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, JwtStrategy],
})
export class AuthModule {}
