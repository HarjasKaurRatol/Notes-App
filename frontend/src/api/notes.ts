import type { Note } from '../types/note'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'

// Extracts the backend's { error: string } message when a request fails,
// falling back to the HTTP status if the body isn't in that shape.
async function parseError(res: Response): Promise<string> {
  try {
    const body = await res.json()
    if (body && typeof body.error === 'string') return body.error
  } catch {
    // response had no JSON body
  }
  return `Request failed with status ${res.status}`
}

export async function getNotes(): Promise<Note[]> {
  const res = await fetch(`${API_URL}/notes`)
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function createNote(title: string, description: string): Promise<Note> {
  const res = await fetch(`${API_URL}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description }),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function deleteNote(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/notes/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(await parseError(res))
}
