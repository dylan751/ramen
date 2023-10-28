import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserRepository } from 'src/db/repositories';
import { OrganizationUsersModule } from '../organizations/users/users.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get('jwt_secret'),
        signOptions: { expiresIn: '30 days' },
      }),
      inject: [ConfigService],
    }),
    OrganizationUsersModule,
    OrganizationsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, JwtStrategy],
})
export class AuthModule {}
