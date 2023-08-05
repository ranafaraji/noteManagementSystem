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
    <div className="home">
        <header className="header">
            <nav>
             <Link to="/home" className="naviLink">Home</Link>

            <Link to="/notebook" className="naviLink">My Notebook</Link>
            <Link to="/search" className="naviLink">Search Notebook</Link>
            <button className="btnLogin"><Link to="/login">Login</Link></button>

            </nav>
        </header>
    </div>
    )
}

export default Home;
