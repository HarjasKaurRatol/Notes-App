import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}
function NoteCard({ note, onDelete }) {
    return (_jsxs("div", { className: "note-card", children: [_jsxs("div", { className: "note-card-header", children: [_jsx("h3", { className: "note-title", children: note.title }), _jsx("button", { type: "button", className: "btn-delete", onClick: () => onDelete(note.id), "aria-label": `Delete note "${note.title}"`, children: "Delete" })] }), note.description && _jsx("p", { className: "note-description", children: note.description }), _jsxs("span", { className: "note-date", children: ["Created ", formatDate(note.created_at)] })] }));
}
export default NoteCard;
