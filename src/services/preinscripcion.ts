// src/services/preinscripcion.ts
import client from '../api/client';

export const enviarPreinscripcion = (data: any) => {
  return client.post('/preinscripcion', data);
};

export const consultarDatosPersona = (params: {
  nombres: string;
  ci: string;
  fecha_nacimiento: string;
  primer_apellido?: string;
  segundo_apellido?: string;
}) => {
  return client.get('/personas/consultar', { params });
};