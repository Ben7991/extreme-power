import { AccountStatus, Role } from '@prisma/client';

export type User = {
  id?: string;
  name: string;
  username: string;
  password?: string;
  role: Role;
  status?: AccountStatus;
};

export type UserProp = {
  id: boolean;
  name: boolean;
  username: boolean;
  role: boolean;
  status: boolean;
};
