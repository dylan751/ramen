import { Injectable } from '@nestjs/common';
import { PermissionRepository } from 'src/db/repositories/permission.repository';
import { PermissionSubjectResponseDto } from './dto/permission-subject-response.dto';

@Injectable()
export class PermissionsService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async findAll(): Promise<PermissionSubjectResponseDto[]> {
    const permissions =
      await this.permissionRepository.findAllPermissionSubjects();

    return permissions;
  }
}
