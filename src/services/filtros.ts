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

//nuevo api 
export const getRelacionNominal = (params: {
  id_centro_reclutamiento: number;
}) => {
  return client.get(`/relacion-nominal/${params.id_centro_reclutamiento}`);
};

//pre-militares
export const getListasCentrosdeReclutamiento= (params: {
  id_fuerza:number
}) => {
  return client.get('/listadecentrosdereclutamiento', { params });
};

export const getResumenRegistroPorUnidadMilitares = (params: {
  id_fuerza?: number;
  id_unidad_militar?: number;
}) => {
  return client.get('/invitaciones/resumen-por-unidad-militares', { params });
};

//nuevo api 
export const getListaInvitados = (params: {
  id_centro_reclutamiento: number;
}) => {
  return client.get(`/listado-invitados/${params.id_centro_reclutamiento}`);
};