import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'OrganizationUniqueNameValidator', async: false })
export class OrganizationUniqueNameValidator
  implements ValidatorConstraintInterface
{
  public validate(orgUniqueName: string): boolean {
    return /^([a-z][a-z0-9-]{1,})*$/.test(orgUniqueName);
  }

  public defaultMessage(): string {
    return 'Organization Unique Name can only contain lowercase letters, numbers, dashes, must start with a letter and has 2 characters minimum';
  }
}
