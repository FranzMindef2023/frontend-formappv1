import client from '../api/client';

export const getDepartamentos = () => client.get('/departamentos');
export const getMunicipiosByDepartamento = (id: number) => client.get(`/municipios/${id}`);
