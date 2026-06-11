/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Alerta {
  id: string;
  timestamp: string;
  tipo: 'whatsapp' | 'email' | 'sms' | 'sistema';
  mensaje: string;
  destino: string;
}

export interface Tramite {
  id: string;
  dni: string;
  nombreCiudadano: string;
  telefono: string;
  correo: string;
  titulo: string;
  descripcion: string;
  categoria: 'licencias' | 'obras' | 'registro' | 'tributacion' | 'otros';
  estado: 'recibido' | 'analizando' | 'observado' | 'aprobado' | 'denegado';
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
  analisisML: {
    categoriaSugerida: string;
    prioridadCalculada: string;
    explicacion: string;
    confianza: number; // 0.0 to 1.0
    sugerenciaResolucion: string;
  };
  fechaCreacion: string;
  alertas: Alerta[];
  feedback?: {
    calificacion: number; // 1 to 5
    comentario: string;
    fechaFeedback: string;
  };
}

export interface Curriculum {
  id: string;
  nombreCandidato: string;
  correo: string;
  telefono: string;
  cargoPostula: string;
  textoCV: string;
  analisisML: {
    puntajeCompatibilidad: number; // 0 to 100
    habilidadesClave: string[];
    estadoRecomendacion: 'aprobado' | 'revision' | 'descartado';
    justificacion: string;
  };
  fechaCreacion: string;
}

export interface PreguntaGuia {
  id: string;
  pregunta: string;
  respuesta: string;
  fundamento: string;
}
