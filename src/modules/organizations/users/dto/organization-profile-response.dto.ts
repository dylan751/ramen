import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { BankType, CurrencyType, Organization, Role } from 'src/db/entities';
import { UserRole } from 'src/modules/common/dto/user-role.dto';
import { ProjectResponseDto } from '../../projects/dto/project-response.dto';

export class OrganizationProfileResponseDto {
  constructor(organization: Organization, roles: Role[]) {
    this.id = organization.id;
    this.name = organization.name;
    this.uniqueName = organization.uniqueName;
    this.phone = organization.phone;
    this.address = organization.address;
    this.dateFormat = organization.dateFormat;
    this.currency = organization.currency;
    this.bank = organization.bank;
    this.exchangeRate = organization.exchangeRate;
    if (organization.projects) {
      this.projects = organization.projects.map(
        (project) => new ProjectResponseDto(project),
      );
    }
    this.roles = roles.map((role) => new UserRole(role));
  }

  @ApiResponseProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiResponseProperty({
    type: String,
    example: 'Organization Fullname',
  })
  name: string;

  @ApiResponseProperty({
    type: String,
    example: 'org_unique_name',
  })
  uniqueName: string;

  @ApiResponseProperty({
    type: String,
    example: '0339089172',
  })
  phone: string;

  @ApiResponseProperty({
    type: String,
    example: '19A Bach Khoa, Ha Noi',
  })
  address: string;

  @ApiResponseProperty({
    type: String,
    example: 'dd/MM/yyyy',
  })
  dateFormat: string;

  @ApiResponseProperty({
    enum: CurrencyType,
    example: CurrencyType.VND,
  })
  @ApiProperty({ enumName: 'CurrencyType' })
  currency: CurrencyType;

  @ApiResponseProperty({
    enum: BankType,
    example: BankType.BIDV,
  })
  @ApiProperty({ enumName: 'BankType' })
  bank: BankType;

  @ApiResponseProperty({
    type: Number,
    example: 25464,
  })
  exchangeRate: number;

  @ApiResponseProperty({
    type: [ProjectResponseDto],
  })
  projects: ProjectResponseDto[];

  @ApiResponseProperty({
    type: [UserRole],
  })
  roles: UserRole[];
}
