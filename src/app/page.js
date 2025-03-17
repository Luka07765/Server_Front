'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [editingNoteTitle, setEditingNoteTitle] = useState('');
  const [editingNoteContent, setEditingNoteContent] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch(`${API_URL}/notes`);
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const addNote = async () => {
    // Proveri da li su oba polja popunjena
    if (!newNoteTitle || !newNoteContent) return;

    const noteData = {
      title: newNoteTitle,
      content: newNoteContent,
    };

    try {
      const res = await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData),
      });
      if (res.ok) {
        setNewNoteTitle('');
        setNewNoteContent('');
        fetchNotes();
      } else {
        console.error('Greška prilikom kreiranja note-a:', res.status);
      }
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await fetch(`${API_URL}/notes/${id}`, { method: 'DELETE' });
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const updateNote = async (id) => {
    if (!editingNoteTitle || !editingNoteContent) return;
    const updatedData = {
      id,
      title: editingNoteTitle,
      content: editingNoteContent,
    };

    try {
      const res = await fetch(`${API_URL}/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (res.ok) {
        setEditingNote(null);
        setEditingNoteTitle('');
        setEditingNoteContent('');
        fetchNotes();
      } else {
        console.error('Greška prilikom ažuriranja note-a:', res.status);
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Notes</h1>

      {/* Forma za dodavanje nove beleške */}
      <div className="mb-4">
        <input
          className="border p-2 mb-2 w-full"
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
          placeholder="New note title..."
        />
        <textarea
          className="border p-2 mb-2 w-full"
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          placeholder="New note content..."
        />
        <button className="p-2 bg-blue-500 text-white" onClick={addNote}>
          Add Note
        </button>
      </div>

      {/* Lista beleški */}
      <ul>
        {notes.map((note) => (
          <li key={note.id} className="border p-2 mb-2">
            {editingNote === note.id ? (
              <div>
                <input
                  className="border p-1 mb-2 w-full"
                  value={editingNoteTitle}
                  onChange={(e) => setEditingNoteTitle(e.target.value)}
                  placeholder="Edit note title"
                />
                <textarea
                  className="border p-1 mb-2 w-full"
                  value={editingNoteContent}
                  onChange={(e) => setEditingNoteContent(e.target.value)}
                  placeholder="Edit note content"
                />
                <button
                  className="p-1 bg-green-500 text-white mr-2"
                  onClick={() => updateNote(note.id)}
                >
                  Save
                </button>
                <button
                  className="p-1 bg-gray-500 text-white"
                  onClick={() => setEditingNote(null)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <h2 className="font-bold">{note.title}</h2>
                <p>{note.content}</p>
                <div className="mt-2">
                  <button
                    className="p-1 bg-yellow-500 text-white mr-2"
                    onClick={() => {
                      setEditingNote(note.id);
                      setEditingNoteTitle(note.title);
                      setEditingNoteContent(note.content);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="p-1 bg-red-500 text-white"
                    onClick={() => deleteNote(note.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
