import type { Note } from '../types/note'
import NoteCard from './NoteCard'

interface NoteListProps {
  notes: Note[]
  onDelete: (id: number) => void
}

function NoteList({ notes, onDelete }: NoteListProps) {
  if (notes.length === 0) {
    return <p className="empty-state">No notes yet. Create your first note above.</p>
  }

  return (
    <div className="note-list">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onDelete={onDelete} />
      ))}
    </div>
  )
}

export default NoteList
