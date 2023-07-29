import React from 'react';
import {useState} from 'react';

const CreateNote = ({handleAddNote}) =>{

    const [noteText, setNoteText]= useState('');
    //event is text input
    const handleChange = (event) =>{
        setNoteText(event.target.value); //sync
        console.log(event.target.value);
    }
    const handleSaveClick = ()=>{
        //empty text can't save
        if(noteText.trim().length > 0){
            handleAddNote(noteText);
            setNoteText(''); //empty in create note
        }
    }


    return(
        <div className='note new'>
            <textarea  placeholder=' type to ass a note...' onChange={handleChange} value={noteText}></textarea>
            <div className='notefooter'>
                <h6>200 remaining </h6>
                <button className="savebtn" onClick={handleSaveClick}>Save</button>
            </div>

        </div>
    )
}

export default CreateNote;