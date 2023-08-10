import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const Search = ({handleSearchNote})=>{
    return <div className='search'>
            <input className='searchbar' 
            onChange={(event)=>handleSearchNote(event.target.value)} 
            type='text' 
            autoFocus 
            placeholder='Enter a keyword'></input>
            <button id='search'><FontAwesomeIcon icon={faMagnifyingGlass}/></button>

    </div>;
};

export default Search;
