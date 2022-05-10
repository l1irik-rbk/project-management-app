import { Error } from './error';

export type UserError = Error & {
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
export type RemoveUserRequest = undefined | UserError;
// TODO: вместо undefined возвращает code 204
// http://localhost:4000/docs/static/index.html#/Users/UsersController_remove

// UsersController_update
export type UpdateUser = User | UserError;

export type Token = { token: string };
