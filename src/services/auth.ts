import { Signup, Signin } from './interfaces/auth';
import { Error } from './interfaces/error';
import { apiUrl } from './utils';

export const signup = async (
  name: string,
  login: string,
  password: string
): Promise<Signup | Error> => {
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

  if (!response.ok) return { statusCode: 666, message: 'Server error' };
  return await response.json();
};

export const signin = async (login: string, password: string): Promise<Signin | Error> => {
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

  if (!response.ok) return { statusCode: 666, message: 'Server error' };
  const { token } = await response.json();

  document.cookie = `token=${token}`;
  return token;
};
