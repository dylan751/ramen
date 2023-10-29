import { applyDecorators, Header } from '@nestjs/common';

export function NoCacheHeaders(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    Header('Cache-Control', 'no-cache, no-store'),
    Header('Pragma', 'no-cache'),
    Header('Expires', '0'),
  );
}
