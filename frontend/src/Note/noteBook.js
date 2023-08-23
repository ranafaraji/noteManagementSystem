
import Note from './note'
import CreateNote from './createNote';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import { useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';

const NoteBook = ({notes, handleAddNote, handleDeleteNote}) =>{

    const [userData, setUserData] = useState({ username: '' });

     useEffect(() => {
        fetchUserData();
    }, []);

     async function fetchUserData(){
        try {
                const fetchedUserData = response.data;
                const response =  axios.get('/get_username', {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            setUserData(fetchedUserData);

            } catch (error) {
             console.error('Error fetching user data:', error);
             }
        }

    return(
        <div id='notehome'>
            <section id='notesec'>
                <header className='noteheader'>
                    <h1>My Notes</h1>

                    <input className='searchbar' type='text' autoFocus placeholder='Enter a keyword'></input>
                    <button id='search'><FontAwesomeIcon icon={faMagnifyingGlass}/></button>
                </header>

                <div className='noteList'>
                <div className="row"> Logged in : <strong className="gfg">  {userData.username} </strong>| <a href='/home'> Logout</a>
                    </div>
                    {notes.map((notes)=>(
                        <Note
                        id={notes.id}
                        text={notes.text}
                        date={notes.date}
                        handleDeleteNote={handleDeleteNote}/>
                    ))}
                    <CreateNote handleAddNote={handleAddNote}
                    />
                    

                </div>

            </section>
        </div>
    )
}

export default NoteBook;