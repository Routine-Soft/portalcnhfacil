export interface Course {
  _id: string
  titulo: string
  descricao: string
  preco: number
  requisitos: string[]
  cargaHoraria: number
  sumario: string[]
  imagem?: string
  createdAt?: string
  updatedAt?: string
}