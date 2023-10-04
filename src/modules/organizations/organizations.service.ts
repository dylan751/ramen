import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateOrganizationRequestDto } from './dto/create-organization-request.dto';
import { UpdateOrganizationRequestDto } from './dto/update-organization-request.dto';
import {
  Organization,
  Role,
  User,
  UserOrganization,
  UserOrganizationRole,
} from 'src/db/entities';
import { OrganizationRepository, UserRepository } from 'src/db/repositories';
import { OrganizationResponseDto } from './dto/organization-response.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly orgRepository: OrganizationRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(
    createRequest: CreateOrganizationRequestDto,
    userId: number,
  ): Promise<OrganizationResponseDto> {
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

    const organizationDto = new OrganizationResponseDto(organization);

    return organizationDto;
  }

  async findById(orgId: number): Promise<Organization> {
    return await this.orgRepository.findById(orgId);
  }

  async update(
    orgId: number,
    updateRequest: UpdateOrganizationRequestDto,
  ): Promise<OrganizationResponseDto> {
    const organization = await this.orgRepository.findById(orgId);
    if (!organization) {
      throw new NotFoundException(`Organization ${orgId} doesn't exist`);
    }

    if (updateRequest.name !== undefined) {
      organization.name = updateRequest.name;
    }

    if (updateRequest.uniqueName !== undefined) {
      organization.uniqueName = updateRequest.uniqueName;
    }

    await organization.save();

    const organizationDto = new OrganizationResponseDto(organization);
    return organizationDto;
  }

  async delete(organizationId: number): Promise<void> {
    await this.orgRepository.manager.transaction(
      async (transactionalManager) => {
        const deletePromises = [];

        deletePromises.push(
          transactionalManager.delete(User, { organizationId }),
        );
        deletePromises.push(
          transactionalManager.delete(Role, { organizationId }),
        );
        deletePromises.push(
          transactionalManager.delete(UserOrganizationRole, { organizationId }),
        );
        deletePromises.push(
          transactionalManager.delete(UserOrganization, { organizationId }),
        );
        deletePromises.push(
          transactionalManager.delete(Organization, { id: organizationId }),
        );

        await Promise.all(deletePromises);
      },
    );
  }
}
