import React from 'react';
import axios from 'axios';
import {useState,useEffect,useRef } from 'react';

import "quill/dist/quill.snow.css";
import TextEdit from './TextEdit'; 
import PropTypes from 'prop-types';



const CreateNote = ({handleAddNote}) =>{

    CreateNote.propTypes = {
        handleAddNote: PropTypes.func.isRequired,
    };
    console.log(typeof handleAddNote);
    
    const CREATENOTE_URL= 'http://localhost:5000/Create_Notes';
    const GETUSERNAME_URL='http://localhost:5000/get_username';
    
    const [noteText, setNoteText]= useState('');
    const [uEmail,setUemail]=useState('');

    /*useEffect(()=>{
        const uEmail=JSON.parse(localStorage.getItem('User_email'));
         if (uEmail) {
            setUemail(uEmail);
            console.log(uEmail);
         }
       },[])*/

       useEffect(() => {
        fetchUsername();
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
    
    const htmlToPlainText = (html) => {
        const temporaryElement = document.createElement('div');
        temporaryElement.innerHTML = html;
        return temporaryElement.textContent || temporaryElement.innerText || '';
      };

    const handleChange = (newContent) => {
        //updates the noteText state with the new content received from the onChange prop. Keeps the noteText state in sync with the editor's content.
        setNoteText(newContent);
        console.log(newContent);
    };

    const handleSaveClick = async(e)=>{
        e.preventDefault();
        if (noteText.trim().length === 0) {
            return; // Don't save if the note is empty
        }
        try{
            const res =await axios.post(CREATENOTE_URL,JSON.stringify({
                email: uEmail, // Use the userEmail state
                notes: htmlToPlainText(noteText) // Sending 'noteText' to match your backend's expected data key
          }),
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            })
            if (res.status === 400 && res.data.error === "Users Does Not Exist") {
                alert("Please login to make sure your notes can be saved in our system.");
            } else {
                // Add the note to the list after successful POST request
                handleAddNote(noteText);
                setNoteText(''); // Clear the note text after saving
            }
           
        }catch(error){
            console.error('An error occurred:', error);

        }
        /*empty text can't save
        if(noteText.trim().length > 0){
            handleAddNote(noteText);
            setNoteText(''); //empty in create note
        }*/
    }

    return(
        <div className='textEditBody'>
        <div className='texteditor'>
          <div className='row'>
            <div className='editor-part'>
              
              <TextEdit initialText={noteText} onChange={handleChange} />
              
                    <button className='savebtn' onClick={handleSaveClick}>Save</button>
                    
        
            </div>
          </div>
        </div>
      </div>

       /* <div className='note new'>
            <textarea  placeholder=' type to add a note...' onChange={handleChange} value={noteText}></textarea>
            <div className='notefooter'>
                
                <button className="savebtn" onClick={handleSaveClick}>Save</button>
            </div>

        </div>*/
    )
}

export default CreateNote;
