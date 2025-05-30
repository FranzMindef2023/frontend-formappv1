import client from '../api/client';
export const getFuerzas = () => client.get('/fuerzas');