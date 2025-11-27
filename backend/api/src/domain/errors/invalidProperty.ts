import { ServiceError } from './serviceError';

export class InvalidProperty extends Error implements ServiceError {
  constructor(message: string) {
    super(message);
  }
}
