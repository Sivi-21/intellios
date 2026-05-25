import { randomUUID } from 'crypto';

export function generateId(prefix = 'ios') {
  return `${prefix}-${randomUUID().slice(0, 12)}`;
}
