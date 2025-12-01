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
  updatedAt?: Date;
}

import { randomUUID } from 'node:crypto';
import { InvalidProperty } from 'src/domain/errors/invalidProperty';

export class User {
  private _id: string;
  protected props: IUserProps;

  constructor(props: IUserProps, id?: string) {
    this.props = props;
    this._id = id ?? randomUUID();
    this.props.createdAt = props.createdAt || new Date();
    this.props.updatedAt = props.updatedAt || null;

    this.validate();
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
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

  changePassword(newPasswordHash: string) {
    this.props.passwordHash = newPasswordHash;
  }

  changeEmail(email: string) {
    this.props.email = email;
  }

  changeName(name: string) {
    this.props.name = name;
  }

  setUpdatedAt() {
    this.props.updatedAt = new Date();
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
