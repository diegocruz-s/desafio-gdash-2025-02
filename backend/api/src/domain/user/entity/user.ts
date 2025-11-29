export enum OptionsAccount {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface IUserProps {
  name: string;
  email: string;
  passwordHash: string;
  role: OptionsAccount;
  createdAt?: Date;
  isActive?: boolean;
}

import { randomUUID } from 'node:crypto';
import { InvalidProperty } from 'src/domain/errors/invalidProperty';

export class User {
  private _id: string;
  private _createdAt: Date;
  private _isActive: boolean;
  protected props: IUserProps;

  constructor(props: IUserProps, id?: string) {
    this.props = props;
    this._id = id ?? randomUUID();
    this._isActive = props.isActive ?? true;
    this._createdAt = props.createdAt || new Date();

    this.validate();
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  get isActive() {
    return this._isActive;
  }

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get passwordHash() {
    return this.props.passwordHash;
  }

  get role() {
    return this.props.role;
  }

  activate() {
    this.props.isActive = true;
  }

  deactivate() {
    this.props.isActive = false;
  }

  changePassword(newPasswordHash: string) {
    this.props.passwordHash = newPasswordHash;
  }

  private validate() {
    if (!['ADMIN', 'USER'].includes(this.props.role)) {
      throw new InvalidProperty('Invalid user role');
    }
  }

  static create(props: IUserProps, id?: string) {
    return new User(props, id);
  }
}
