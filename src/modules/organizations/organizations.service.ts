import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateOrganizationRequestDto } from './dto/create-organization-request.dto';
import { UpdateOrganizationRequestDto } from './dto/update-organization-request.dto';
import { Organization } from 'src/db/entities';
import { OrganizationRepository, UserRepository } from 'src/db/repositories';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly orgRepository: OrganizationRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(
    createRequest: CreateOrganizationRequestDto,
    userId: number,
  ): Promise<Organization> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User ${userId} doesn't exist`);
    }
    const organization = new Organization();

    const orgByUniqueName = await this.orgRepository.findByUniqueName(
      createRequest.uniqueName,
    );
    if (orgByUniqueName) {
      throw new UnprocessableEntityException(
        `${createRequest.uniqueName} already exists`,
      );
    }
    organization.name = createRequest.name;
    organization.uniqueName = createRequest.uniqueName;
    organization.users = [];
    organization.users.push(user);

    await this.orgRepository.manager.transaction(async (manager) => {
      await manager.save(Organization, organization);
    });

    return organization;
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
