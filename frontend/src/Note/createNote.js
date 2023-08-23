import React from 'react';
import {useState} from 'react';
import axios from '../api/axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';


const Create_Notes_URL = 'http://localhost:5000/Create_Notes';
//const userString = localStorage.getItem('');
const email = '';

const CreateNote = ({ handleAddNote, userEmail }) => {
//const [userData, setUserData] = useState({ username: '', message: '' });
    const [noteText, setNoteText] = useState('');
    const handleChange = (event) => {
        setNoteText(event.target.value);
        console.log(event.target.value);
    };

    const [userInput, setUserInput] = useState('');

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };


   const handleSaveClick = async () => {
        if (noteText.trim().length > 0) {
            try {
                const response_userEmail = await axios.get('/get_username', {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
                });

                const userEmail = response_userEmail.data.username;
                const response = await fetch (Create_Notes_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ notes: noteText, email: userEmail }), // Include the email in the payload
                });

                if (response.ok) {
                    const newNote = await response.json();
                    handleAddNote(newNote); // Update your state or UI here
                    setNoteText(newNote);
                } else {
                    console.error('Failed to create note');
                }
            } catch (error) {
                console.error('Error creating note:', error);
            }
        }
    };

    return(
        <div className='note new'>
            <textarea
            placeholder=' type to add a note...'
            onChange={handleChange}
            value={noteText}>
            </textarea>
            <div className='notefooter'>
                <h6>200 remaining </h6>
                <button className="savebtn" onClick={handleSaveClick}>Save</button>
            </div>

        </div>
    )
}

export default CreateNote;