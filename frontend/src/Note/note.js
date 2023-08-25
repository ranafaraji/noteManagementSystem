import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan,faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';


const Note = ({id, text, date, handleDeleteNote,handleFetchNote}) =>{

    const [isEditing, setIsEditing] = useState(false);
    //const [editedText, setEditedText] = useState(text);

    useEffect(() => {
        handleFetchNote();
    }, [handleFetchNote]);


    const handleEditClick = () => {
        setIsEditing(true);
      };
    
      
    return(
        
        <div className='note'>
            <span>
                {text}
            </span>
            <div className='notedatedel' >
                <h6>{date}</h6>
                <FontAwesomeIcon icon={faTrashCan} className='icon' onClick={()=>handleDeleteNote(id)} />
                
                <Link className='icon' to={`/editNote/${id}/${encodeURIComponent(text)}`} >
                <FontAwesomeIcon icon={faPenToSquare} />
                </Link>
                
            </div>
        </div> 
    )
}

export default Note;
