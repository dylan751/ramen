import { ApiResponseProperty } from '@nestjs/swagger';
import { PermissionSubjectInterface } from 'src/db/repositories';

export class PermissionSubjectResponseDto {
  constructor(subjects: PermissionSubjectInterface[]) {
    subjects.map((subject) => {
      this.subject = subject.subject;
    });
  }

  @ApiResponseProperty({
    type: String,
    example: 'organization',
  })
  subject: string;
}
