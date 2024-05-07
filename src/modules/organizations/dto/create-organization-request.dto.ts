import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Validate } from 'class-validator';
import { OrganizationUniqueNameValidator } from 'src/modules/common/validators/organization-unique-name.validator';

export class CreateOrganizationRequestDto {
  @ApiProperty({
    type: String,
    example: 'Example organization',
    required: true,
  })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    type: String,
    example: 'example-org',
    required: true,
  })
  @IsNotEmpty()
  @Validate(OrganizationUniqueNameValidator)
  readonly uniqueName: string;

  @ApiProperty({
    type: String,
    example: '0339089172',
    required: true,
  })
  @IsNotEmpty()
  readonly phone: string;

  @ApiProperty({
    type: String,
    example: '19A Bach Khoa, Ha Noi',
    required: true,
  })
  @IsNotEmpty()
  readonly address: string;
}
