export const INVOICE_SUFFIX_LENGTH = 3;
export const INVOICE_PREFIX = 'INV-';

export function generateRandomUID(length: number) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;
  let uid = '';
  for (let i = 0; i < length; i++) {
    uid += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return uid;
}

export function generateInvoiceUID(prefix: string, randomSuffixLength: number) {
  return prefix + generateRandomUID(randomSuffixLength);
}
