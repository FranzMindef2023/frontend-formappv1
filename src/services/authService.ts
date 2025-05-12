import client from '../api/client';

export const login = (email: string, password: string, captcha: string) => {
  return client.post('/auth/login', {
    email,
    password,
    captcha,
  });
};
