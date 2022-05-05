export const apiUrl = 'https://kanbanboar.herokuapp.com';

export const getToken = () => {
  const token = document.cookie.split('token=')[1];
  return token ? token : null;
};
