import React, { useState } from 'react';
import NoteContext from './noteContext';

const NoteState = (props) => {
    const host = "http://localhost:5000";
    const notesInitial = [];
    const [notes, setNotes] = useState(notesInitial);

    // Helper function to get auth token
    const getAuthToken = () => {
        return localStorage.getItem('token');
    };

    // Get all notes 
    const getNotes = async () => {
        try {
            const response = await fetch(`${host}/api/notes/fetchallnotes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": getAuthToken()
                },
            });

            const json = await response.json();
            console.log(json);
            setNotes(json);
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    };

    // Adding a note
    const addNote = async (title, description, tag) => {
        try {
            const response = await fetch(`${host}/api/notes/addnote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": getAuthToken()
                },
                body: JSON.stringify({ title, description, tag })
            });

            const note = await response.json();
            console.log("Adding new note:", note);
            setNotes((prevNotes) => [...prevNotes, note]);
        } catch (error) {
            console.error("Error adding note:", error);
        }
    };

    // DELETE A NOTE
    const deleteNote = async (id) => {
        try {
            const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": getAuthToken()
                },
            });

            const json = await response.json();
            console.log(json);

            if (json.success) {
                setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
            } else {
                console.error("Error deleting note:", json.message);
            }
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };

    // EDIT A NOTE
    const editNote = async (id, title, description, tag) => {
        try {
            const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    "auth-token": getAuthToken()
                },
                body: JSON.stringify({ title, description, tag })
            });

            const json = await response.json();
            console.log(json);

            if (json.success) {
                setNotes((prevNotes) =>
                    prevNotes.map((note) =>
                        note._id === id ? { ...note, title, description, tag } : note
                    )
                );
            } else {
                console.error("Error updating note:", json.message);
            }
        } catch (error) {
            console.error("Error editing note:", error);
        }
    };

    return (
        <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
            {props.children}
        </NoteContext.Provider>
    );
};

export default NoteState;
