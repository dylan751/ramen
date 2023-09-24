import { Injectable } from '@nestjs/common';
import { CreateRoleRequestDto } from './dto/create-role-request.dto';
import { UpdateRoleRequestDto } from './dto/update-role-request.dto';

@Injectable()
export class RolesService {
  create(createRoleRequestDto: CreateRoleRequestDto) {
    return 'This action adds a new role';
  }

  findAll() {
    return `This action returns all role`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleRequestDto: UpdateRoleRequestDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
