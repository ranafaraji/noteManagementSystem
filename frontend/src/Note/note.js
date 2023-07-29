import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";


const Note = ({id, text, date, handleDeleteNote}) =>{

    /*const [currentDateTime, setCurrentDateTime] = useState('');

    useEffect(() => {
          setCurrentDateTime(new Date());
        }, []);*/

    return(
        <div className='note'>
            <span>
                {text}
            </span>
            <div className='notedatedel'>
                <h6>{date}</h6>
                <FontAwesomeIcon icon={faTrashCan} onClick={()=>handleDeleteNote(id)} />

            </div>
        </div>
    )
}

export default Note;