import { jsx as _jsx } from "react/jsx-runtime";
import NoteCard from './NoteCard';
function NoteList({ notes, onDelete }) {
    if (notes.length === 0) {
        return _jsx("p", { className: "empty-state", children: "No notes yet. Create your first note above." });
    }
    return (_jsx("div", { className: "note-list", children: notes.map((note) => (_jsx(NoteCard, { note: note, onDelete: onDelete }, note.id))) }));
}
export default NoteList;
