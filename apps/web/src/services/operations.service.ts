import api from './api';

export interface Visita {
  id: string;
  nomeVisitante: string;
  unidadeId: string;
  dataVisita: string;
  janelaInicio: string;
  janelaFim: string;
  status: 'ATIVA' | 'UTILIZADA' | 'EXPIRADA' | 'CANCELADA';
}

export interface Ocorrencia {
  id: string;
  categoria: string;
  descricao: string;
  status: 'ABERTA' | 'EM_ANALISE' | 'RESOLVIDA';
  origem: string;
  criadoEm: string;
}

export interface Reserva {
  id: string;
  areaNome: string;
  unidadeId: string;
  dataReserva: string;
  inicio: string;
  fim: string;
  status: string;
}

export async function getVisitasAtivas(data: string) {
  const res = await api.get<Visita[]>('/operations/visitas/ativas', { params: { data } });
  return res.data;
}

export async function confirmarEntrada(visitaId: string) {
  const res = await api.patch<Visita>(`/operations/visitas/${visitaId}/entrada`);
  return res.data;
}

export async function createOcorrencia(payload: { categoria: string; descricao: string; origem: string }) {
  const res = await api.post<Ocorrencia>('/operations/ocorrencias', payload);
  return res.data;
}

export async function getOcorrencias(): Promise<Ocorrencia[]> {
  const res = await api.get<Ocorrencia[]>('/operations/ocorrencias');
  return res.data;
}

export async function resolverOcorrencia(id: string): Promise<Ocorrencia> {
  const res = await api.patch<Ocorrencia>(`/operations/ocorrencias/${id}/resolver`);
  return res.data;
}

export async function getReservas(): Promise<Reserva[]> {
  const res = await api.get<Reserva[]>('/operations/reservas');
  return res.data;
}
