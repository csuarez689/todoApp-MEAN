export interface Task {
  id?: string;
  titulo: string;
  descripcion?: string;
  prioridad: string;
  estado: string;
  imagen?: string;
  fechaCreacion?: Date;
  fechaLimite?: Date;
  fechaResoucion?: Date;
  idLista: string;
}
