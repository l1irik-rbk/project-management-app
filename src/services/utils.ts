export const apiUrl = 'https://kanbanboar.herokuapp.com';

export const getToken = () => {
  return getCookie('token');
};

export const getLogin = () => {
  return getCookie('login');
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
