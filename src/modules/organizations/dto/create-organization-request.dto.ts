import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Validate } from 'class-validator';
import { OrganizationUniqueNameValidator } from 'src/modules/common/validators/organization-unique-name.validator';

export class CreateOrganizationRequestDto {
  @ApiProperty({
    example: 'Example organization',
  })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    example: 'example-org',
  })
  @IsNotEmpty()
  @Validate(OrganizationUniqueNameValidator)
  readonly uniqueName: string;
}
