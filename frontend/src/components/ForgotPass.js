
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

  const [email, setEmail] = useState('');
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
        const response = await axios.post(FORGOTPASS_URL, { email }); // Use Axios to send a POST request
        console.log(response?.data);
        setMessage(response.data.message); // Get the message from the response data
        console.log(response?.accessToken);
        console.log(JSON.stringify(response))
        setSuccess(true);
        setPass('');
        setMatchPass('');

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
        {success ? (
                <section>
                   
{/*====================password field=================*/}
                        <section id="lgsec">
                        <h1>Reset Password</h1>
                        <label htmlFor="password">
                            Password:
                            <FontAwesomeIcon icon={faCheck} className={validPass ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPass || !pass ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPass(e.target.value)}
                            value={pass}
                            required
                            aria-invalid={validPass ? "false" : "true"}
                            aria-describedby="passnote"
                            onFocus={() => setPassFocus(true)}
                            onBlur={() => setPassFocus(false)}
                        />
                        <p id="passdnote" className={passFocus && !validPass ? "instructions" : "offscreen"}>
                        
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>

{/*====================confirm pass==================*/}
                        <label htmlFor="confirm_pass">
                            Confirm Password:
                            <FontAwesomeIcon icon={faCheck} className={validMatch && matchPass ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPass ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="confirm_pass"
                            onChange={(e) => setMatchPass(e.target.value)}
                            value={matchPass}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must match the first password input field.
                        </p>
                        <button onClick={handleButtonClick}>Reset Now</button>
                        </section>
                </section>
            ) : (
        <section id="forgotpass">
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Forgot Password</h1>
            <br/>
            <form onSubmit={handleSubmit}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter registered email"
        />
            <button type="submit" onClick={handleSubmit}>Submit</button>
        </form>
        <p>{message}</p>
      </section>
      )}
    </div>
  );
};

export default ForgotPassword;