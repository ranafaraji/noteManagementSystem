import { Router,Routes, Route, BrowserRouter } from 'react-router-dom';
import {useState,useEffect} from 'react';
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
import Search from './Note/search';
import TextEdit from './Note/TextEdit';
import axios from 'axios';



function App(){

  const getNote_URL= 'http://localhost:5000/get_Notes';
  const GETUSERNAME_URL='http://localhost:5000/get_username';
  const UPDATENOTE_URL='http://localhost:5000/UpdateNotes';
  const DELETENOTE_URL='http://localhost:5000/DeleteNotesContent';
  const [uEmail,setUemail]=useState('');
  const [notes, setNotes] = useState([]);
  const [searchText, setSearchText]= useState('');


 

   //=================getusername========================
   //====================================================
   useEffect(() => {
    fetchUsername();
    fetchNotes();
}, []);

const fetchUsername = async () => {
    try {
        const response = await axios.get(GETUSERNAME_URL, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });

        const fetchedUsername = response.data.username;
        setUemail(fetchedUsername);
    } catch (error) {
        console.error('Error fetching username:', error);
    }
};
  //====================================================
  //====================================================

  
    const fetchNotes = async () => {
      try {
        const response = await axios.get(getNote_URL, {
          params: { email: uEmail }, // Pass the email as a query parameter
          headers: { 'Accept': 'application/json' },
          withCredentials: true
        });
        const notesData = response.data.map(item => ({
          id: item.notesid, 
          text: item.notes,
          date: item.date,
        }));
  
        console.log('Notes fetched:', response.data); // Display response data
        setNotes(notesData);
      } catch (error) {
        console.log('Error fetching notes:', error);
        console.log(error.response.data.message);
        console.log(error.response.status);
        //console.log(error.response.headers);
      }
    };
  

    const addNote = async (text) => {
      console.log(text);
      const date = new Date();
      const newNote = {
        text: text,
        date: date.toLocaleDateString(),
        id: nanoid() // Generate a unique ID for the note
      };
    
      try {
        await axios.post(UPDATENOTE_URL, {
          notes: newNote.text,
          notes_id: newNote.id // Use the correct property name
        });
    
        //console.log(response.data.message); // Display the server response message
        const updatedNoteList = [...notes, newNote];
        setNotes(updatedNoteList);
      } catch (error) {
        console.log('Error adding note:', error);
      }
    };
    

  //==================================================
  const deleteNote = async (id) => {
    try {
      console.log('Deleting note with ID:', id);
  
      const res = await axios.delete(
        DELETENOTE_URL,
        {
          data: { notes: id }, // Send the data as an object with the key "notes"
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
  
      console.log('Delete response:', res);
  
      if (res.status === 201) {
        const newNotes = notes.filter((note) => note.id !== id);
        setNotes(newNotes);
      }
    } catch (error) {
      console.error('An error occurred:', error);
      console.log('Error response:', error.response);
    }
  };
  //=====================================================
  
 
  return(

     <Routes>
          <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home/>}/>
          <Route path="/home" element={<Home/>}/>
            {/*Route below are protected*/}
            <Route path="/ForgotPass" element={<ForgotPassword/>}/>
            <Route element={<RequireAuth/>}/>
            <Route path="/addnotes" element={<addnotes/>}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={<Register/>}/>

            
            
              <Route path="/notebook" element={
              <>
                
                <NoteBook
                
                notes={notes.filter((note) =>
                 note.text.toLowerCase().includes(searchText)
                )}
                handleFetchNote={fetchNotes}
                handleAddNote={addNote}
                handleDeleteNote={deleteNote}
                />
             </>
            }/>

              <Route path="/create-note" element={<Note />}/>
              <Route path="/textEdit" element={<TextEdit/>}/>
              <Route path="/createNote" element={<CreateNote handleAddNote={addNote}/>}/>
              <Route path="/editNote/:id/:text" element={<TextEdit />} />
              <Route path="/search-note" element={<>
                <Search handleSearchNote={setSearchText} />
                <NoteBook
                
                notes={notes.filter((note) =>
                 note.text.toLowerCase().includes(searchText)
                )}
                handleFetchNote={fetchNotes}
                handleAddNote={addNote}
                handleDeleteNote={deleteNote}
                />
             </>}/>
            
            </Route>
     </Routes>
   

 
  



  
  );
}

export default App;
