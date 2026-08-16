import { useState } from 'react'
import type { Note } from './types/note'
import NoteForm from './components/NoteForm'
import NoteList from './components/NoteList'
import './App.css'

// Temporary mock data so the UI can be reviewed before the backend API exists.
const MOCK_NOTES: Note[] = [
  {
    id: 1,
    title: 'Welcome to Notes',
    description: 'This is a sample note to show how the app looks with content.',
    created_at: '2026-08-10T09:00:00.000Z',
  },
  {
    id: 2,
    title: 'Grocery list',
    description: 'Milk, eggs, bread, coffee.',
    created_at: '2026-08-12T14:30:00.000Z',
  },
  {
    id: 3,
    title: 'Project ideas',
    description: 'Sketch out the API routes and database schema this weekend.',
    created_at: '2026-08-14T18:15:00.000Z',
  },
]

function App() {
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES)

  const handleCreate = (title: string, description: string) => {
    const newNote: Note = {
      id: Date.now(),
      title,
      description,
      created_at: new Date().toISOString(),
    }
    // TODO: replace with a POST request to the backend API once it exists.
    setNotes((prev) => [newNote, ...prev])
  }

  const handleDelete = (id: number) => {
    // TODO: replace with a DELETE request to the backend API once it exists.
    setNotes((prev) => prev.filter((note) => note.id !== id))
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Notes</h1>
        <p className="subtitle">A simple full-stack notes application</p>
      </header>

      <section className="card">
        <h2>Create Note</h2>
        <NoteForm onCreate={handleCreate} />
      </section>

      <section className="notes-section">
        <h2>Your Notes</h2>
        <NoteList notes={notes} onDelete={handleDelete} />
      </section>
    </div>
  )
}

export default App
