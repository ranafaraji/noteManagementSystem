
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
import Note from './Note/note';
import NoteBook from './Note/noteBook';



function App(){

  const [notes, setNotes] = useState([
      {
        id:nanoid(),
        text:"Hahahah",
        date:"15/04/2021"
      },
      {
        id:nanoid(),
        text:"wuwuwuw",
        date:"16/04/2021"
      },
      {
        id:nanoid(),
        text:"miaooo",
        date:"17/04/2021"
      },
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
            {/*Route below are protected*/}
            <Route path="/ForgotPass" element={<ForgotPassword/>}/>
            <Route element={<RequireAuth/>}/>
            
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>

            <Route path="/notebook" element={<NoteBook notes={notes} handleAddNote={addNote} handleDeleteNote={deleteNote}/>}/>
            <Route path="/create-note" element={<Note/>}/>
            <Route path="/edit-note/:id" element={<CreateNote/>}/>
            </Route>
     </Routes>
   

  
  );
}

export default App;
