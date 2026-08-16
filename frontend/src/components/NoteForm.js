import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
function NoteForm({ onCreate }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const handleSubmit = (event) => {
        event.preventDefault();
        const trimmedTitle = title.trim();
        const trimmedDescription = description.trim();
        if (!trimmedTitle)
            return;
        onCreate(trimmedTitle, trimmedDescription);
        setTitle('');
        setDescription('');
    };
    return (_jsxs("form", { className: "note-form", onSubmit: handleSubmit, children: [_jsxs("div", { className: "form-field", children: [_jsx("label", { htmlFor: "note-title", children: "Title" }), _jsx("input", { id: "note-title", type: "text", placeholder: "Note title", value: title, onChange: (event) => setTitle(event.target.value) })] }), _jsxs("div", { className: "form-field", children: [_jsx("label", { htmlFor: "note-description", children: "Description" }), _jsx("textarea", { id: "note-description", placeholder: "Note description", rows: 4, value: description, onChange: (event) => setDescription(event.target.value) })] }), _jsx("button", { type: "submit", className: "btn-primary", children: "Create Note" })] }));
}
export default NoteForm;
