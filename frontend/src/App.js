import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';
import './App.css';
// Temporary mock data so the UI can be reviewed before the backend API exists.
const MOCK_NOTES = [
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
];
function App() {
    const [notes, setNotes] = useState(MOCK_NOTES);
    const handleCreate = (title, description) => {
        const newNote = {
            id: Date.now(),
            title,
            description,
            created_at: new Date().toISOString(),
        };
        // TODO: replace with a POST request to the backend API once it exists.
        setNotes((prev) => [newNote, ...prev]);
    };
    const handleDelete = (id) => {
        // TODO: replace with a DELETE request to the backend API once it exists.
        setNotes((prev) => prev.filter((note) => note.id !== id));
    };
    return (_jsxs("div", { className: "page", children: [_jsxs("header", { className: "page-header", children: [_jsx("h1", { children: "Notes" }), _jsx("p", { className: "subtitle", children: "A simple full-stack notes application" })] }), _jsxs("section", { className: "card", children: [_jsx("h2", { children: "Create Note" }), _jsx(NoteForm, { onCreate: handleCreate })] }), _jsxs("section", { className: "notes-section", children: [_jsx("h2", { children: "Your Notes" }), _jsx(NoteList, { notes: notes, onDelete: handleDelete })] })] }));
}
export default App;
