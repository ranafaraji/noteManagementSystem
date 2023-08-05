
import Note from './note'
import CreateNote from './createNote';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";


const NoteBook = ({notes, handleAddNote, handleDeleteNote}) =>{

    
    return(
        <div id='notehome'>
            <section id='notesec'>
                <header className='noteheader'>
                    <h1>My Notes</h1>
                    <input className='searchbar' type='text' autoFocus placeholder='Enter a keyword'></input>
                    <button id='search'><FontAwesomeIcon icon={faMagnifyingGlass}/></button>
                </header>

                <div className='noteList'>
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