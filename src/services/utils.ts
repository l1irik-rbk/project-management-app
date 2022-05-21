import { getUsers } from './users';

export const apiUrl = 'https://kanbanboar.herokuapp.com';

export const getToken = () => {
  return getCookie('token');
};

export const getLogin = () => {
  return getCookie('login');
};

export const getLanguage = () => {
  return getCookie('i18next');
};

function getCookie(cname: string) {
  // https://www.w3schools.com/js/js_cookies.asp
  const name = cname + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}

export const successObject = { success: true };

export const findUser = async (login: string) => {
  const allUser = await getUsers();
  const user = Array.isArray(allUser) && allUser.find((user) => user.login === login);

  if (!user) return null;
  return user;
};

export const getUserId = async () => {
  const login = getLogin();
  if (login) {
    const user = await findUser(login);
    const userId = user?.id;

    if (userId) return userId;
    else return null;
  } else return null;
};
