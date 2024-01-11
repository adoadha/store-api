import { ClientError } from "./client-error";

export class InvariantError extends ClientError {
  constructor(public message: string) {
    super(message, 400, "InvariantError");

    Object.setPrototypeOf(this, InvariantError.prototype);
  }
}
