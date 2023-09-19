import { Injectable } from '@nestjs/common';
import { CreateOrganizationRequestDto } from './dto/create-organization-request.dto';
import { UpdateOrganizationRequestDto } from './dto/update-organization-request.dto';

@Injectable()
export class OrganizationsService {
  create(createOrganizationRequestDto: CreateOrganizationRequestDto) {
    return 'This action adds a new organization';
  }

  findAll() {
    return `This action returns all organizations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} organization`;
  }

  update(
    id: number,
    updateOrganizationRequestDto: UpdateOrganizationRequestDto,
  ) {
    return `This action updates a #${id} organization`;
  }

  remove(id: number) {
    return `This action removes a #${id} organization`;
  }
}
