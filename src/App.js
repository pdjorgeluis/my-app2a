import './App.css';
import React from 'react'

//Components
import Note from './components/Note';
import Notification from './components/Notification'

import { useState, useEffect } from 'react'
import axios from 'axios'

//Services
import noteService from './services/notes'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error might happen ;) ...')

  useEffect(() => {
    console.log('effect');
    /*axios
      .get('http://localhost:3001/notes')
      .then(response => {
        console.log('promise fulfilled');
        setNotes(response.data);
      })*/
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, []);
  //console.log('render', notes.length, 'notes');

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      //id: notes.length + 1
    }
    //setNotes(notes.concat(noteObject))
   /*axios
      .post('http://localhost:3001/notes', noteObject)
      .then(response => {
        console.log(response)
        setNotes(notes.concat(response.data))
        setNewNote('')
      })*/
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote));
        setNewNote('')
      })  
  }

  //Event Handlers
  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value)
  }

  const toggleImportanceOf = id => {
    const url = `http://localhost:3001/notes/${id}`
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
  
    /*axios.put(url, changedNote).then(response => {
      setNotes(notes.map(n => n.id !== id ? n : response.data))
    })*/
    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote));
      })
      .catch(error => {
        setErrorMessage(`the note '${note.content}' was already deleted from the server`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000)
        //alert(`the note '${note.content}' was already deleted from the server`);
        setNotes(notes.filter(n => n.id !== id)); // removing deleted note from the application state
      })
  }

  // Array of notes to Show
  const notesToShow = showAll ? notes : notes.filter(note => note.important === true)

  const Footer = () => {
    const footerStyle = {
      color: 'green',
      fontStyle: 'italic',
      fontSize: 16
    }
    return (
      <div style={footerStyle}>
        <br /> 
        <em>Note app, Department of Computer Science, University of Helsinki 2024</em>
      </div>
    )
  }
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
        </div>
        <ul>
        {notesToShow.map(note => 
          <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)}/>
        )}
        </ul>
      
      <form onSubmit={addNote}>
        <input 
          value = {newNote} 
          onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  );
}

export default App;
