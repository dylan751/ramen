import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { OrganizationRepository, UserRepository } from 'src/db/repositories';
import { ProfileResponseDto } from '../../auth/dto/profile-response.dto';
import { OrganizationUserListResponseDto } from './dto/organization-user-list-response.dto';
import { OrganizationUserResponseDto } from '../../common/dto/organization-user-response.dto';
import { UpdateOrganizationUserRequestDto } from './dto/update-organization-user-request.dto';
import { RoleRepository } from 'src/db/repositories/role.repository';
import {
  Role,
  User,
  UserOrganization,
  UserOrganizationRole,
} from 'src/db/entities';
import { UserOrganizationRoleRepository } from 'src/db/repositories/user-organization-role.repository';
import { TotalAdminResponseDto } from './dto/total-admin-response.dto';
import { BulkInviteRequestDto } from './dto/bulk-invite-request.dto';
import { BulkInviteResponseDto } from './dto/bulk-invite-response.dto';
import { UserOrganizationRepository } from 'src/db/repositories/user-organization.repository';
import { CanNotDisableTheLastAdminException } from 'src/modules/common/exceptions/base.exception';
import { Not } from 'typeorm';

export interface UserAttributes {
  email: string;
  name?: string;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly userOrganizationRepository: UserOrganizationRepository,
    private readonly userOrganizationRoleRepository: UserOrganizationRoleRepository,
  ) {}

  async findByOrganization(
    organizationId: number,
  ): Promise<OrganizationUserListResponseDto> {
    const users = await this.userRepository.findByOrganizationWithUserOrgRole(
      organizationId,
    );

    const userDtos = users.map(
      (user) =>
        new OrganizationUserResponseDto(user, user.userOrganizations[0]),
    );

    const result = new OrganizationUserListResponseDto();
    result.users = userDtos;
    return result;
  }

  async countAdmin(organizationId: number): Promise<TotalAdminResponseDto> {
    const totalAdmins = await this.userOrganizationRoleRepository.countAdmin(
      organizationId,
    );
    return { totalAdmins };
  }

  async bulkInvite(
    organizationId: number,
    requestDto: BulkInviteRequestDto,
  ): Promise<BulkInviteResponseDto> {
    const roleIds = requestDto.roleIds;

    await this.checkRoles(organizationId, roleIds);

    const organization = await this.organizationRepository.findById(
      organizationId,
    );
    if (!organization) {
      throw new UnprocessableEntityException(
        'Requested organization is not exist: ' + organizationId,
      );
    }

    // A unique email list
    const emailsSet = new Set(requestDto.emails);
    const requestedEmails = Array.from(emailsSet);

    const existingUsers =
      await this.userRepository.findManyWithUserOrganization(
        organizationId,
        requestedEmails,
      );

    const usersMap: { [index: string]: User } = {};
    existingUsers.forEach((u) => (usersMap[u.email] = u));

    const newUserEmails = requestedEmails.filter((email) => !usersMap[email]);
    const emailsToInvite: string[] = [];
    const skippedEmail: string[] = [];

    await this.userRepository.manager.transaction(
      async (transactionalManager) => {
        const newUsers = newUserEmails.map((email) =>
          this.userFromAttributes({ email }),
        );
        await transactionalManager.save(newUsers);
        newUsers.forEach((user) => (usersMap[user.email] = user));

        const userOrganizationsToUpdate: UserOrganization[] = [];
        const userOrganizationRolesToUpdate: UserOrganizationRole[] = [];
        const deletePromises = [];

        for (const key in usersMap) {
          const user = usersMap[key];
          let userOrg =
            user.userOrganizations && user.userOrganizations.length > 0
              ? user.userOrganizations[0]
              : null;

          if (!userOrg) {
            userOrg = new UserOrganization();
            userOrg.organizationId = organizationId;
            userOrg.userId = user.id;

            userOrganizationsToUpdate.push(userOrg);
            emailsToInvite.push(user.email);

            for (const roleId of roleIds) {
              const userOrgRole = new UserOrganizationRole();
              userOrgRole.userId = user.id;
              userOrgRole.organizationId = organizationId;
              userOrgRole.roleId = roleId;
              userOrganizationRolesToUpdate.push(userOrgRole);
            }

            deletePromises.push(
              transactionalManager.delete(UserOrganizationRole, {
                userId: user.id,
                organizationId,
              }),
            );
          } else {
            skippedEmail.push(user.email);
          }
        }

        await Promise.all(deletePromises);
        await transactionalManager.save(userOrganizationsToUpdate);
        await transactionalManager.save(userOrganizationRolesToUpdate);
      },
    );

    // await this.sendInvitations(emailsToInvite, organization); // TODO: Implement sendgrid

    const response = new BulkInviteResponseDto();
    response.invitedCount = emailsToInvite.length;
    response.notInvitedCount = skippedEmail.length;
    return response;
  }

  async update(
    organizationId: number,
    userId: number,
    request: UpdateOrganizationUserRequestDto,
  ): Promise<OrganizationUserResponseDto> {
    const userOrganization = await this.userOrganizationRepository.findOne({
      where: { userId, organizationId },
      relations: ['user', 'roles'],
    });

    if (!userOrganization) {
      throw new NotFoundException(
        `user ${userId} does not belong to the organization ${organizationId}`,
      );
    }

    const roleIds = request.roleIds;
    await this.checkRoles(organizationId, roleIds);

    if (userOrganization.isAnActiveAdmin()) {
      const { totalAdmins } = await this.countAdmin(organizationId);

      if (totalAdmins === 1 && !roleIds.includes(Role.ADMIN_ROLE_ID)) {
        throw new CanNotDisableTheLastAdminException(
          'There are no admins after this action',
        );
      }
    }

    await this.userOrganizationRoleRepository.manager.transaction(
      async (transactionalManager) => {
        await transactionalManager.delete(UserOrganizationRole, {
          userId,
          organizationId,
        });
        return await Promise.all(
          roleIds.map((roleId) =>
            transactionalManager.save(UserOrganizationRole, {
              userId,
              organizationId,
              roleId,
            }),
          ),
        );
      },
    );

    const updatedUserOrganization =
      await this.userOrganizationRepository.findOne({
        where: { userId, organizationId },
        relations: ['user', 'roles'],
      });
    return new OrganizationUserResponseDto(
      updatedUserOrganization.user,
      updatedUserOrganization,
    );
  }

  async deleteByIdAndOrgId(
    organizationId: number,
    userId: number,
  ): Promise<void> {
    const userOrg = await this.userOrganizationRepository.findOne({
      where: { organizationId, userId },
      relations: ['organization', 'user', 'roles'],
    });

    if (!userOrg) {
      throw new NotFoundException(
        `User ${userId} doesn't belong to organization ${organizationId}`,
      );
    }

    if (userOrg.isAnActiveAdmin()) {
      await this.throwErrorIfThereIsOnlyOneAdminLeft(organizationId);
    }

    const otherUserOrganizationsCount =
      await this.userOrganizationRepository.count({
        where: { userId, organizationId: Not(organizationId) },
      });

    await this.userRepository.manager.transaction(
      async (transactionalManager) => {
        const promises: Promise<unknown>[] = [];

        // if the user doesn't belong to any other organization delete it
        if (otherUserOrganizationsCount === 0) {
          promises.push(transactionalManager.delete(User, { id: userId }));
        }

        promises.push(
          transactionalManager.delete(UserOrganization, {
            organizationId,
            userId,
          }),
        );
        promises.push(
          transactionalManager.delete(UserOrganizationRole, {
            organizationId,
            userId,
          }),
        );

        await Promise.all(promises);
      },
    );
  }

  async findByIdWithOrganizations(id: number): Promise<User> {
    return await this.userRepository.findByIdWithOrganizations(id);
  }

  async findByIdWithOrganizationsAndRoles(
    id: number,
  ): Promise<ProfileResponseDto> {
    const user = await this.userRepository.findByIdWithOrganizationsAndRoles(
      id,
    );
    const profile = new ProfileResponseDto(user);

    return profile;
  }

  private userFromAttributes(attrs: UserAttributes): User {
    const user = new User();
    this.setUserAttributes(user, attrs);
    return user;
  }

  private setUserAttributes(user: User, attrs: UserAttributes): void {
    user.email = attrs.email;
    user.name = attrs.email.split('@')[0];
  }

  public async throwErrorIfThereIsOnlyOneAdminLeft(
    organizationId: number,
  ): Promise<void> {
    const adminCount = await this.userOrganizationRoleRepository.countAdmin(
      organizationId,
    );
    if (adminCount === 1) {
      throw new CanNotDisableTheLastAdminException(
        `Can not delete the only admin of organization ${organizationId}`,
      );
    }
  }

  async checkRoles(organizationId: number, roleIds: number[]): Promise<void> {
    const roles = await this.roleRepository.findByIds(roleIds);

    roles.forEach((role) => {
      if (!role.belongsToOrg(organizationId)) {
        throw new NotFoundException(
          `Role ${role.id} does not belong to organization ${organizationId}`,
        );
      }

      if (!role) {
        throw new NotFoundException(`Role do not exist ${role.id}`);
      }
    });
  }
}
