import React from 'react';
import { useRef, useState, useEffect } from 'react';
import Note from './note';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NoteBook = ({notes, handleAddNote, handleDeleteNote,handleFetchNote }) =>{


    
    const [userData, setUserData] = useState({ username: '' });

     useEffect(() => {
        fetchUserData();
        handleFetchNote();
    }, []);


    
     async function fetchUserData(){
        try {
                const response =  await axios.get('/get_username', {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            const fetchedUserData = response.data;
            setUserData(fetchedUserData);
            console.log(response);


            } catch (error) {
             console.error('Error fetching user data:', error);
             }
        }

        const htmlToPlainText = (html) => {
            const temporaryElement = document.createElement('div');
            temporaryElement.innerHTML = html;
            return temporaryElement.textContent || temporaryElement.innerText || '';
          };
        

   
    return(
        <div id='notehome'>
            <div className='noteContainer'>
                <section id='notesec'>
                    <header className='noteheader'>
                         <h1>My Notes</h1>
                     </header>

                    <div className='noteList'>
                    <div className="row"> Logged in : <strong className="gfg">  {userData.username} </strong>| <a href='/home'> Logout</a></div>

                    {notes.map((notes)=>(
                        <Note 
                        id={notes.id} 
                        text={htmlToPlainText(notes.text)}
                        date={notes.date} 
                        handleDeleteNote={handleDeleteNote}
                        handleFetchNote={handleFetchNote}/>
                    ))}
                    
                   <Link
                    to={{
                    pathname: '/createNote',
                    state: { handleAddNote }
                    }}>
                    <FontAwesomeIcon className='addbtn' icon={faCirclePlus} />
                    </Link>
                    
               
              
                    
                    </div>
                
                </section>
                
             </div>
        </div>
        
    )
}

export default NoteBook;
