import { Signup, Signin } from './interfaces/auth';
import { ResponseError } from './interfaces/error';
import { apiUrl } from './utils';

export const signup = async (
  name: string,
  login: string,
  password: string
): Promise<Signup | ResponseError> => {
  const response = await fetch(`${apiUrl}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      login,
      password,
    }),
  });
  return await response.json();
};

export const signin = async (login: string, password: string): Promise<Signin | ResponseError> => {
  const response = await fetch(`${apiUrl}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      login,
      password,
    }),
  });

  const result = await response.json();

  if (result.hasOwnProperty('token')) {
    document.cookie = `token=${result.token}; expires=${new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 7
    ).toUTCString()}`;
    document.cookie = `login=${login}; expires=${new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 7
    ).toUTCString()}`;
  }
  return result;
};
