import api from './api';
import type { Ocorrencia } from './operations.service';

export interface Comunicado {
  id: string;
  titulo: string;
  conteudo: string;
  publicadoEm: string;
  ativo: boolean;
}

export interface Reserva {
  id: string;
  areaNome: string;
  dataReserva: string;
  inicio: string;
  fim: string;
  status: 'PENDENTE' | 'APROVADA' | 'REJEITADA' | 'CANCELADA';
  unidadeId: string;
}

export async function getComunicados(): Promise<Comunicado[]> {
  const res = await api.get<Comunicado[]>('/governance/comunicados');
  return res.data;
}

export async function createComunicado(payload: { titulo: string; conteudo: string }): Promise<Comunicado> {
  const res = await api.post<Comunicado>('/governance/comunicados', payload);
  return res.data;
}

export async function getReservas(): Promise<Reserva[]> {
  const res = await api.get<Reserva[]>('/operations/reservas');
  return res.data;
}
