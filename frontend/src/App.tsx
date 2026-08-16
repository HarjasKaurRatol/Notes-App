import { useEffect, useState } from 'react'
import type { Note } from './types/note'
import NoteForm from './components/NoteForm'
import NoteList from './components/NoteList'
import { getNotes, createNote, deleteNote } from './api/notes'
import './App.css'

function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    getNotes()
      .then((data) => {
        if (isMounted) setNotes(data)
      })
      .catch((err: unknown) => {
        if (isMounted) setError(err instanceof Error ? err.message : 'Failed to load notes')
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const handleCreate = async (title: string, description: string) => {
    setError(null)
    try {
      const newNote = await createNote(title, description)
      setNotes((prev) => [newNote, ...prev])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create note')
    }
  }

  const handleDelete = async (id: number) => {
    setError(null)
    try {
      await deleteNote(id)
      setNotes((prev) => prev.filter((note) => note.id !== id))
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete note')
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Notes</h1>
        <p className="subtitle">A simple full-stack notes application</p>
      </header>

      {error && <p className="error-banner">{error}</p>}

      <section className="card">
        <h2>Create Note</h2>
        <NoteForm onCreate={handleCreate} />
      </section>

      <section className="notes-section">
        <h2>Your Notes</h2>
        {isLoading ? (
          <p className="empty-state">Loading notes…</p>
        ) : (
          <NoteList notes={notes} onDelete={handleDelete} />
        )}
      </section>
    </div>
  )
}

export default App
