import { Course } from '@/types/course'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export async function getCourses(): Promise<Course[]> {
  const res = await fetch(`${API}/courses`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Erro ao buscar cursos')
  return res.json()
}

export async function getCourseById(id: string): Promise<Course> {
  const res = await fetch(`${API}/courses/${id}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Curso não encontrado')
  return res.json()
}