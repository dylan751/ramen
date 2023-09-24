import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from 'src/db/repositories';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
})
class UsersModule {}

export { UsersModule as OrganizationUsersModule };
