import client from '../api/client';

export const getCentrosdeReclutamientos = (params: {
  id_fuerza:number
}) => {
  return client.get('/centrosdereclutamiento', { params });
};

export const getUnidadesMilitares= (params: {
  id_centro_reclutamiento:number
}) => {
  return client.get('/unidadesmilitares', { params });
};

export const getListasUnidadesMilitares= (params: {
  id_fuerza:number
}) => {
  return client.get('/listaunidadesmilitares', { params });
};

export const getResumenRegistroPorUnidad = (params: {
  id_fuerza?: number;
  id_unidad_militar?: number;
  gestion?: number;
}) => {
  return client.get('/personas/resumen-por-unidad', { params });
};

export const getPersonasFiltradas = (params: {
  id_fuerza?: number;
  id_centro_reclutamiento?: number;
  id_unidad_militar?: number;
}) => {
  return client.get('/personas/filtrar', { params });
};
