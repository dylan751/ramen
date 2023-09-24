import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from 'src/db/repositories';
import { RoleRepository } from 'src/db/repositories/role.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRepository, RoleRepository],
  exports: [UsersService],
})
class UsersModule {}

export { UsersModule as OrganizationUsersModule };
