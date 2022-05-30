import { successObject } from '../utils';
import { ResponseError } from './error';

export type UserError = ResponseError & {
  error: string;
};

// UsersController_getAll
export type GetUsers = User[] | UserError;

export type User = {
  id: string;
  name: string;
  login: string;
};

// UsersController_getOne
export type GetUser = User | UserError;

// UsersController_remove
export type RemoveUser = typeof successObject | UserError;

// UsersController_update
export type UpdateUser = User | UserError;

export type Token = { token: string };
