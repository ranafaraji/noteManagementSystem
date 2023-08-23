import { useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import axios from '../api/axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';


const LOGIN_URL = '/auth'; //connect backend



const Login = () => {
    //to access the value of a context object that has been created using the createContext function
    const { setAuth } = useAuth();
    const navi= useNavigate();
    const location =useLocation();
    const from= location.state?.from?.pathname || "/notebook"; 

    const [token, setToken] = useState();

    //focus area
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');



    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            //define response ()
            const response = await axios.post(LOGIN_URL,
                //api
                JSON.stringify({ user, pwd }),
                {
                    //third object
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }

            );

            //only data property
            console.log(JSON.stringify(response?.data));
            //all data
            //console.log(JSON.stringify(response));
            const accessToken = response?.data?.accessToken; 
            //array
            const roles = response?.data?.roles;
            const userString = localStorage.getItem('user');

            setAuth({ user, pwd, roles, accessToken });
            navi(from, {replace:true});
             
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                //expected info not exist
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus(); //screen reader focus error display
        }
    }


//=====================================================
   return (
        <div div id="loginregis">
                <section id="lgsec">
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Sign In</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">E-mail:</label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={user} //clear form
                            required
                        />

                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                        />

                        <button>Sign In</button>
                    </form>
                    <p id='remind'>
                        Create an account :<br />
                        <span className="line">
                            <Link to="/register" style={{color:'white', textDecoration:'underline'}}>Sign Up</Link>
                        </span>
                    </p>
                    <br/>
                    <p id='remind'>
                    <br />
                        <span className="line">
                            <Link to="/ForgotPass" style={{color:'white', textDecoration:'underline'}}>Forgot Password?</Link>
                        </span>

                    </p>

                    <p id='remind'>
                    <br />
                        <span className="line">
                            <Link to="/Home" style={{color:'white', textDecoration:'underline'}}>Home</Link>
                        </span>
                    </p>
                </section>
        </div>
    )
}

export default Login;
