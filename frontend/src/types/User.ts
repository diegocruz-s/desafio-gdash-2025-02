export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface ICreatedUser {
  name: string;
  email: string;
  password: string;
}