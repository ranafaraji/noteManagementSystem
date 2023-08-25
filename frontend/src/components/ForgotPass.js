
import axios from '../api/axios';
import { useNavigate , Link } from 'react-router-dom';
import { useRef, useState, useEffect} from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const FORGOTPASS_URL = '/ForgotPass';

const pass_regex= /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;


const ForgotPassword = () => {
    const userRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();

    const handleButtonClick = () => {
        // Navigate to the 'other' page
        navigate ('/login');
      };

  const [mail, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

const [pass, setPass] = useState('');
  const [validPass, setValidPass] = useState(false);
  const [passFocus, setPassFocus] = useState(false);

  const [matchPass, setMatchPass] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);
    
 useEffect(() => {
    setValidPass(pass_regex.test(pass));
    setValidMatch(pass === matchPass);
    setErrMsg('');
}, [pass, matchPass]) //sync


const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post(FORGOTPASS_URL,
                JSON.stringify({ mail }),
                     {
                    //third object
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                    }
                ); // Use Axios to send a POST request
        console.log(response?.data);
        setMessage(response.data.message); // Get the message from the response data
        console.log(response?.accessToken);
        console.log(JSON.stringify(response))
        setSuccess(true);
//        setPass('');
//        setMatchPass('');

        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 404) {
                //conflict between the requested resources and the current state of the server
                setErrMsg('Email not registered. Please enter another email.');
            } else {
                setErrMsg('Submit Failed')
            }

        }
    };


    return (
        <div id="loginregis">
    
            <section id="forgotpass">
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <h1>Forgot Password</h1>
                <br/>
                <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={mail}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter registered email"
            />
                <button type="submit" onClick={handleSubmit}>Submit</button>
            </form>
            <p>{message}</p>
              <br/>
                        <p id='remind'>
                            <span className="line">
                                <Link to="/Login" style={{color:'white', textDecoration:'underline' }}>LOGIN</Link>
                            </span>
                        </p>
          </section>
    
        </div>
      );
    };

export default ForgotPassword;
