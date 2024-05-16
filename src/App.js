import logo from './logo.svg';
import './App.css';
import React from 'react'

//Components
import Note from './components/Note';

const App = ({notes}) => {
  
  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
    </div>
  );
}

export default App;
