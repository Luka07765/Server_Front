'use client';
import React, { useState, useEffect } from 'react';
import NoteService from './axios';

function NotesApp() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editNote, setEditNote] = useState(null);

  // Fetch all notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const notes = await NoteService.getAllNotes();
      setNotes(notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    try {
      await NoteService.createNote(newNote);
      setNewNote({ title: '', content: '' });
      fetchNotes();
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleUpdateNote = async (e) => {
    e.preventDefault();
    try {
      await NoteService.updateNote(editNote.id, editNote);
      setEditNote(null);
      fetchNotes();
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await NoteService.deleteNote(id);
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div>
      <h1>Notes App</h1>

      {/* Create/Edit Form */}
      <form onSubmit={editNote ? handleUpdateNote : handleCreateNote}>
        <input
          type="text"
          placeholder="Title"
          value={editNote ? editNote.title : newNote.title}
          onChange={(e) =>
            editNote
              ? setEditNote({ ...editNote, title: e.target.value })
              : setNewNote({ ...newNote, title: e.target.value })
          }
        />
        <textarea
          placeholder="Content"
          value={editNote ? editNote.content : newNote.content}
          onChange={(e) =>
            editNote
              ? setEditNote({ ...editNote, content: e.target.value })
              : setNewNote({ ...newNote, content: e.target.value })
          }
        />
        <button type="submit">
          {editNote ? 'Update Note' : 'Create Note'}
        </button>
        {editNote && (
          <button type="button" onClick={() => setEditNote(null)}>
            Cancel Edit
          </button>
        )}
      </form>

      {/* Notes List */}
      <div className="notes-list">
        {notes.map((note) => (
          <div key={note.id} className="note">
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <button onClick={() => setEditNote(note)}>Edit</button>
            <button onClick={() => handleDeleteNote(note.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotesApp;
