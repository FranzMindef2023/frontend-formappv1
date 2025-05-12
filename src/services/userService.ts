import client from '../api/client';

export const getUsers = () => client.get('/users');