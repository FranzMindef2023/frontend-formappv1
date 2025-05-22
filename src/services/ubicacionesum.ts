import client from '../api/client';


export const getProvinciasByDepartamento = (id: number) => client.get(`/provinciasum/${id}`);
