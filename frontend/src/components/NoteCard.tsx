import type { Note } from '../types/note'

interface NoteCardProps {
  note: Note
  onDelete: (id: number) => void
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function NoteCard({ note, onDelete }: NoteCardProps) {
  return (
    <div className="note-card">
      <div className="note-card-header">
        <h3 className="note-title">{note.title}</h3>
        <button
          type="button"
          className="btn-delete"
          onClick={() => onDelete(note.id)}
          aria-label={`Delete note "${note.title}"`}
        >
          Delete
        </button>
      </div>

      {note.description && <p className="note-description">{note.description}</p>}

      <span className="note-date">Created {formatDate(note.created_at)}</span>
    </div>
  )
}

export default NoteCard
