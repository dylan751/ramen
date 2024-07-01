import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateOrganizationRequestDto } from './dto/create-organization-request.dto';
import { UpdateOrganizationRequestDto } from './dto/update-organization-request.dto';
import {
  Organization,
  Role,
  RolePermission,
  UserOrganization,
  UserOrganizationRole,
} from 'src/db/entities';
import {
  OrganizationRepository,
  RoleRepository,
  UserRepository,
} from 'src/db/repositories';
import { OrganizationResponseDto } from './dto/organization-response.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly orgRepository: OrganizationRepository,
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
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
    organization.phone = createRequest.phone;
    organization.address = createRequest.address;
    organization.users = [];
    organization.users.push(user);

    await this.orgRepository.manager.transaction(async (manager) => {
      await manager.save(Organization, organization);

      try {
        const orgCreationPromises = [];

        orgCreationPromises.push(manager.save(Organization, organization));

        orgCreationPromises.push(
          manager.insert(
            UserOrganizationRole,
            UserOrganizationRole.create({
              organizationId: organization.id,
              userId: user.id,
              roleId: Role.ADMIN_ROLE_ID,
            }),
          ),
        );

        await Promise.all(orgCreationPromises);
      } catch (e) {
        throw new InternalServerErrorException(e);
      }
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

    if (updateRequest.phone !== undefined) {
      organization.phone = updateRequest.phone;
    }

    if (updateRequest.address !== undefined) {
      organization.address = updateRequest.address;
    }

    if (updateRequest.dateFormat !== undefined) {
      organization.dateFormat = updateRequest.dateFormat;
    }

    if (updateRequest.currency !== undefined) {
      organization.currency = updateRequest.currency;
    }

    if (updateRequest.bank !== undefined) {
      organization.bank = updateRequest.bank;
    }

    if (updateRequest.exchangeRate !== undefined) {
      organization.exchangeRate = updateRequest.exchangeRate;
    }

    await organization.save();

    const organizationDto = new OrganizationResponseDto(organization);
    return organizationDto;
  }

  async delete(organizationId: number): Promise<void> {
    const organizationRoles =
      await this.roleRepository.findCustomRolesForOrganization(organizationId);

    await this.orgRepository.manager.transaction(
      async (transactionalManager) => {
        const deletePromises = [];

        organizationRoles.forEach((role) =>
          deletePromises.push(
            transactionalManager.delete(RolePermission, { roleId: role.id }),
          ),
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
