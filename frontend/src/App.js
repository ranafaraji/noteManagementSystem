import { Router,Routes, Route, BrowserRouter } from 'react-router-dom';
import {useState} from 'react';
import {nanoid} from 'nanoid';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPass';
import Layout from './components/Layout';
import Home from './components/Home';
import RequireAuth from './components/RequireAuth';
import CreateNote from './Note/createNote';
import NoteBook from './Note/noteBook';



function App(){


  const [notes, setNotes] = useState([


  ]);


    const addNote=(text)=>{
      console.log(text);
      const date = new Date();
      const newNote = {
        id: nanoid(),
        text: text,
        date: date.toLocaleDateString()
      }

      const updateNote=[...notes,newNote];
      setNotes(updateNote);

    }

    const deleteNote=(id)=>{
      const newNotes= notes.filter((note)=>note.id!==id);
      setNotes(newNotes);
    }

  return(
     <Routes>
          <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home/>}/>
          <Route path="/home" element={<Home/>}/>
            {/*Route below are protected*/}
            <Route path="/ForgotPass" element={<ForgotPassword/>}/>
            <Route element={<RequireAuth/>}/>
            <Route path="/addnotes" element={<addnotes/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>

            <Route path="/notebook" element={<NoteBook notes={notes} handleAddNote={addNote} handleDeleteNote={deleteNote}/>}/>
            <Route path="/create-note" element={<note/>}/>
            <Route path="/edit-note/:id" element={<CreateNote/>}/>
          </Route>
     </Routes>
  
  );
}

export default App;
