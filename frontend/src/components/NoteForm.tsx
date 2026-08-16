import { useState } from 'react'
import type { FormEvent } from 'react'

interface NoteFormProps {
  onCreate: (title: string, description: string) => void
}

function NoteForm({ onCreate }: NoteFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    const trimmedTitle = title.trim()
    const trimmedDescription = description.trim()
    if (!trimmedTitle) return

    onCreate(trimmedTitle, trimmedDescription)
    setTitle('')
    setDescription('')
  }

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="note-title">Title</label>
        <input
          id="note-title"
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      <div className="form-field">
        <label htmlFor="note-description">Description</label>
        <textarea
          id="note-description"
          placeholder="Note description"
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <button type="submit" className="btn-primary">
        Create Note
      </button>
    </form>
  )
}

export default NoteForm
