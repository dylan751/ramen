import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { BankType, CurrencyType, Organization } from 'src/db/entities';

export class OrganizationResponseDto {
  constructor(organization: Organization) {
    this.id = organization.id;
    this.name = organization.name;
    this.uniqueName = organization.uniqueName;
    this.phone = organization.phone;
    this.address = organization.address;
    this.dateFormat = organization.dateFormat;
    this.currency = organization.currency;
    this.bank = organization.bank;
    this.exchangeRate = organization.exchangeRate;
    this.createdAt = organization.createdAt;
  }

  @ApiResponseProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiResponseProperty({
    type: String,
    example: 'Test org',
  })
  name: string;

  @ApiResponseProperty({
    type: String,
    example: 'test-org',
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
    type: Date,
    example: '2024-02-26T07:31:35.000Z',
  })
  createdAt: Date;
}

export class OrganizationResponseListDto {
  constructor(organizations: Organization[]) {
    this.organizations = organizations.map(
      (organization) => new OrganizationResponseDto(organization),
    );
  }

  @ApiResponseProperty({
    type: [OrganizationResponseDto],
  })
  organizations: OrganizationResponseDto[];
}
