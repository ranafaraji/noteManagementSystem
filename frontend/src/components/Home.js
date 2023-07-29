import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";


const Home = () => {
    
  /*  const navigate = useNavigate();

    const logout = async () => {
        // if used in more components, this should be in context 
        // axios to /logout endpoint 
        
        navigate('/linkpage');
    }
*/
    return (
        <section>
            <h1>Home</h1>
            <br />
            <p>You are logged in!</p>
            <br />
            
        </section>
    )
}

export default Home;