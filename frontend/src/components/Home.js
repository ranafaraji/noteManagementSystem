import { Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';


const Home = () => {

    const [userData, setUserData] = useState({ username: '', message: '' });

     useEffect(() => {
        fetchUserData();
    }, []);

     async function fetchUserData(){
        try {
//                const response_userEmail = await axios.get('/logout', {
//                headers: { 'Content-Type': 'application/json' },
//                withCredentials: true
//                });

//                setUserData(response_userEmail.data.username);

//            const fetchedUserData = response.data;
//            setUserData(fetchedUserData);
            } catch (error) {
             console.error('Error fetching user data:', error);
             }
        }

  /*  const navigate = useNavigate();

    const logout = async () => {
        // if used in more components, this should be in context 
        // axios to /logout endpoint 
        
        navigate('/linkpage');
    }
*/
   return (
    <div className="home">
        <h2>Welcome to use this Note Management Application!</h2>
        <header className="header">
        
            <nav>
             <Link to="/home" className="naviLink">Home</Link>

            <Link to="/notebook" className="naviLink">My Notebook</Link>
            <Link to="/search-note" className="naviLink">Search Notebook</Link>
            <button className="btnLogin"><Link to="/login">Login</Link></button>
           

            </nav>
        </header>
        
    </div>
    )
}

export default Home;

