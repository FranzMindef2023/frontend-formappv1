// src/services/preinscripcion.ts
import client from '../api/client';

export const enviarPreinscripcion = (data: any) => {
  return client.post('/preinscripcion', data);
};
