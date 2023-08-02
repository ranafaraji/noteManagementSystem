import { useRef, useState, useEffect} from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../api/axios'; // Import the Axios instance with the correct base URL
import { Link } from "react-router-dom";



const user_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
/*[a-zA-Z0-9._%+-]+: (before the "@" symbol). It allows for one or more occurrences of alphanumeric characters (a-z, A-Z, 0-9), as well as certain special characters (._%+-).

[a-zA-Z0-9.-]+: domain name the email. It allows for one or more occurrences of alphanumeric characters (a-z, A-Z, 0-9), as well as periods and hyphens.

\.: dot (.) 

[a-zA-Z]{2,}: This part matches the top-level domain, minimum length of 2 characters .

$: end of the input string.*/

const pass_regex= /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
/*?= is a positive lookahead, a type of zero-width assertion. captured match must be followed by whatever is within the parentheses but that part isn't captured.

(?=.*[a-z]) - It ensures that the string contains at least one lowercase letter (a-z).

(?=.*[A-Z]) - It ensures that the string contains at least one uppercase letter (A-Z).

(?=.*[0-9]) -Ensures that the string contains at least one digit (0-9).

(?=.*[!@#$%]) -Ensures that the string contains at least one special character from the set [!@#$%].*/

const REGISTER_URL = 'http://localhost:5000/register';
//end point backend api


const Register = () => {
    const userRef = useRef(); /*focus user input*/
    const errRef = useRef();

    const [mail, setMail] = useState(''); /*user input*/
    const [validName, setValidName] = useState(false); /*after test*/
    const [userFocus, setUserFocus] = useState(false); //focus user part

    const [pass, setPass] = useState('');
    const [validPass, setValidPass] = useState(false);
    const [passFocus, setPassFocus] = useState(false);

    const [matchPass, setMatchPass] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    /*focus when component load*/
    useEffect(() => {
        userRef.current.focus();
    }, [])

    /*to validate user*/
    useEffect(() => {
        setValidName(user_regex.test(mail));
    }, [mail])

    /*to validate password*/
    useEffect(() => {
        setValidPass(pass_regex.test(pass));
        setValidMatch(pass === matchPass);
    }, [pass, matchPass]) //sync

    /*Error Message*/
    useEffect(() => {
        setErrMsg('');
    }, [mail, pass, matchPass]) /*once user change one of the info, error meaasge come out*/


    
    //submit the form==============================
    const handleSubmit = async (e) => {
        e.preventDefault();// to prevent hack by default submit form
        //to prevent subimit button can be pressed
        const v1 = user_regex.test(mail);
        const v2 = pass_regex.test(pass);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ mail, pass }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(response?.data); //respone from server
            console.log(response?.accessToken);
            console.log(JSON.stringify(response))
            setSuccess(true);
            //clear state and controlled inputs
            //need value attrib on inputs for this
            setMail('');
            setPass('');
            setMatchPass('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                //conflict between the requested resources and the current state of the server 
                setErrMsg('Email Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus(); //focus err screen reader 
        }
    }


/*============================================================ */
    return (
        <div id="loginregis">
        {/*if have a acc, if not register*/}
            {success ? (
                <section>
                    <h1 style={{color:'green'}}>Success!</h1>
                    <span className="line">
                            <Link to="/login" style={{color:'green', textDecoration:'underline'}}>Sign In</Link>
                        </span>
                </section>
            ) : (
                <section id="lgsec">
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p> {/*content within that element should be announced to screen readers immediately and interrupt any ongoing speech*/}
                    <h1 className="regis">Register</h1>
                    <form onSubmit = {handleSubmit}>
{/*====================user field===========================*/}
                        <label htmlFor="email">
                            E-mail:
                             {/*to check if not valid, hide the green mark, should be true after test the user regex, display green mark*/} 
                            <FontAwesomeIcon icon={faCheck}
                            className={validName ? "valid" : "hide"} />
                             {/*by default is false, if valid true hide red mark, or user state empty, if it is not empty, hide red mark*/}
                            <FontAwesomeIcon icon={faTimes} className={validName || !mail ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="text"
                            id="email"
                            ref={userRef}/*focus input*/
                            autoComplete="off"/*didnt display previous input value*/
                            onChange={(e) => setMail(e.target.value)}/*user state*/
                            value={mail}
                            required/*to specify input must be filled out before submitting*/
                            aria-invalid={validName ? "false" : "true"}/*to determine valid input before submit
                            dont have validname, if have validn name will return true*/
                            aria-describedby="uidnote"/*provide additional information read by screen readers, used to read what type and ariainvalid*/
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />
                        {/*aria described by set requirement*/}
                        {/*if userfocus true, user state exist not  empty, not a valid name*/}

                        {/*display condition let user know how to set username*/}
                        <p id="uidnote" className={userFocus && mail && !validName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            
                        </p>

{/*====================password field=================*/}
                        <label htmlFor="password">
                            Password:
                             {/*if pass valid value is false, hide green check mark; if true valid green mark*/}
                            <FontAwesomeIcon icon={faCheck} className={validPass ? "valid" : "hide"} />
                            {/*if validpass false or pass is empty, invalid red mark */}
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
                        {/*if focus on pass field and not valid pass */}
                        <p id="passdnote" className={passFocus && !validPass ? "instructions" : "offscreen"}>
                        
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>

{/*====================confirm pass==================*/}
                        <label htmlFor="confirm_pass">
                            Confirm Password:
                            {/*if valid match value is false where matchpass not same as pass and matchPass should have input , hide green mark; else the valid match value become true will display green mark*/}
                            <FontAwesomeIcon icon={faCheck} className={validMatch && matchPass ? "valid" : "hide"} />

                            {/*if valid match value is false or matchpass is blank , invalid */}
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

{/*===============Sign up button===================== */}
                        {/*disable until all condition fulfill to prevents the button from being clicked
                        one of this true then can click*/}
                        <button disabled={!validName || !validPass || !validMatch ? true : false}>Sign Up</button>
                    </form>
                    <p id='remind'>
                        Already have an account?<br />
                        <span className="line">
                            <Link to="/login" style={{color:'white', textDecoration:'underline'}}>Sign In</Link>
                        </span>
                    </p>
                </section>
            )}
        </div>
    )
}

export default Register;
