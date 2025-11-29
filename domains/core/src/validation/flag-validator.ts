import type { Flag } from '../types/entities.js';

export class FlagValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FlagValidationError';
  }
}

const FLAG_KEY_REGEX = /^[a-z0-9][a-z0-9-_]*[a-z0-9]$/;
const MAX_FLAG_KEY_LENGTH = 100;
const MAX_FLAG_NAME_LENGTH = 200;

/**
 * Validates flag properties.
 * Throws FlagValidationError if validation fails.
 */
export function validateFlag(flag: Partial<Flag>): void {
  if (!flag.key) {
    throw new FlagValidationError('Flag key is required');
  }

  if (flag.key.length > MAX_FLAG_KEY_LENGTH) {
    throw new FlagValidationError(`Flag key must be ${MAX_FLAG_KEY_LENGTH} characters or less`);
  }

  if (!FLAG_KEY_REGEX.test(flag.key)) {
    throw new FlagValidationError(
      'Flag key must start and end with alphanumeric characters and contain only lowercase letters, numbers, hyphens, and underscores'
    );
  }

  if (!flag.name) {
    throw new FlagValidationError('Flag name is required');
  }

  if (flag.name.length > MAX_FLAG_NAME_LENGTH) {
    throw new FlagValidationError(`Flag name must be ${MAX_FLAG_NAME_LENGTH} characters or less`);
  }

  if (!flag.valueType) {
    throw new FlagValidationError('Flag value type is required');
  }

  if (flag.defaultValue === undefined || flag.defaultValue === null) {
    throw new FlagValidationError('Flag default value is required');
  }
}
