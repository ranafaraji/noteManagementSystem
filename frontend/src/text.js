import { useRef,useState,useEffect } from "react";
import { faCheck,faTimes,faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const user_regex = /^[a-zA-Z] [a-zA-Z0-9-_] {3,23}$/;
/*[a-zA-Z] - This character class represents a single character that can be any uppercase or lowercase letter of the English alphabet.
[a-zA-Z0-9-] - This character class represents a single character that can be an uppercase or lowercase letter of the English alphabet, a digit (0-9), an underscore (), or a hyphen (-).

 String that starts with a single letter (uppercase or lowercase), followed by a single character that can be a letter (uppercase or lowercase), a digit, an underscore, or a hyphen. The total length of the string should be between 4 and 24 characters.*/

const pass_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

/*?= is a positive lookahead, a type of zero-width assertion. captured match must be followed by whatever is within the parentheses but that part isn't captured.

(?=.*[a-z]) - It ensures that the string contains at least one lowercase letter (a-z).

(?=.*[A-Z]) - It ensures that the string contains at least one uppercase letter (A-Z).

(?=.*[0-9]) -Ensures that the string contains at least one digit (0-9).

(?=.*[!@#$%]) -Ensures that the string contains at least one special character from the set [!@#$%].*/

const Register = () => {
    const userRef = useRef(); /*focus user input*/
    const errRef = useRef(); 

    const [user,setUser] = useState(''); /*user input*/
    const [validName,setValidName] = useState(false); /*after test*/
    const [userFocus,setUserFocus] = useState(false);//focus user part

    const [pass,setPass] = useState(''); 
    const [validPass,setValidPass] = useState(false); 
    const [passFocus,setPassFocus] = useState(false);

    const [matchPass,setMatchPass] = useState('');
    const [validMatch,setValidMatch] = useState(false); 
    const [matchFocus,setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);


    /*focus when component load*/
    useEffect(()=> {
        useRef.current.focus();
    }, [])

    /*to validate user*/
    useEffect(()=>{
        const result = user_regex.test(user);
        console.log(result);
        console.log(user);
        setValidName(result);
    }, [user])

    /*to validate password*/
    useEffect(()=>{
        const result = pass_regex.test(pass);
        console.log(result);
        console.log(pass);
        setValidPass(result);
        const match = pass===matchPass;
        setValidMatch(match); 
    },[pass,matchPass]) //sync

    /*Error Message*/
    useEffect(()=>{
        setErrMsg('');
    },[user, pass, matchPass]) /*once user change one of the info, error meaasge come out*/

    const handleSubmit = async(e)=>{
        e.preventDefault(); // to prevent hack by default submit form
        //to prevent subimit button can be pressed
        const t1=user_regex.test(user);
        const t2=pass_regex.test(pass);
        if(!t1 || !t2){
            setErrMsg("Invalid Entry");
            return;
        }
        console.log(user,pass);
        setSuccess(true);

    }

    return (
        <>
        {success ? (
            <section>
                <h1>Success!</h1>
                <p>
                    <a href="#">Sign In</a>
                </p>
            </section>
        ): (
        <section>
            <p ref={errRef} className={errMsg ?"errmsg":"offscreen"} aria-live="assertive">{errMsg}</p> {/*content within that element should be announced to screen readers immediately and interrupt any ongoing speech*/}
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                {/*first input=================*/}
                <label htmlFor="username">
                    Username:
                    {/*to check if valid, hide the green mark*/}
                    <span className={validName?"valid":"hide"}>
                        {/*green check mark*/}
                        <FontAwesomeIcon icon={faCheck}/>
                    </span> 
                    {/*if valid hide red mark, or user state empty*/}
                    <span className={validName || !user?"hide":"invalid"}>
                        <FontAwesomeIcon icon={faTimes}/>
                    </span>
                </label>

                <input 
                    type="text" 
                    id="username" 
                    ref={userRef} /*focus input*/
                    autoComplete="off" /*didnt display previous input value*/
                    onChange={(e) =>{setUser(e.target.value)}} /*user state*/
                    required /*to specify input must be filled out before submitting*/
                    aria-invalid={validName?"false":"true"} /*to determine valid input before submit
                    dont have validname, if have validn name will return true*/
                    aria-describedby="uidnote" /*provide additional information read by screen readers, used to read what type and ariainvalid*/
                    onFocus={()=>{setUserFocus(true)}}
                    onBlur={()=>{setUserFocus(false)}}/>

                
                {/*aria described by set requirement*/}
                {/*if userfocus true, user state exist not empty, not a valid name*/}
                <p id="uidnote" className={userFocus && user && !validName ? "instructions":"offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle}/>
                    4 to 24 characters.<br/>
                    Must begin with a letter.<br/>
                    Letters, numbers, underscores, hyphens allowed.
                </p>



                <label htmlFor="password">
                    Password:
                    <span className={validPass?"valid":"hide"}>
                        {/*green check mark*/}
                        <FontAwesomeIcon icon={faCheck}/>
                    </span> 
                    <span className={validPass || !pass?"hide":"invalid"}>
                        <FontAwesomeIcon icon={faTimes}/>
                    </span>
                </label>

                <input
                    type="password"
                    id="password"
                    onChange={(e)=>setPass(e.target.value)}
                    required
                    aria-invalid={validPass?"false":"true"}
                    aria-describedby="passnote"
                    onFocus={()=>setPassFocus(true)}
                    onBlur={()=>setPassFocus(false)}
                />

                <p id="passnote" className={passFocus && pass && !validPass ? "instructions":"offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle}/>
                    Minimum 8 to Maximum 24 characters.<br/>
                    Must include uppercase and lowercase letters, a numbers and special character.<br/>
                    Allowed special characters: 
                    <span aria-label="exclamation mark">!</span>
                    <span aria-label="at symbol">@</span>
                    <span aria-label="hashtag">#</span>
                    <span aria-label="dollar sign">$</span>
                    <span aria-label="percent">%</span>
                </p>



                <label htmlFor="con_pass">
                    Confirm Password:
                    <span className={validMatch && matchPass ?"valid":"hide"}>
                        {/*green check mark*/}
                        <FontAwesomeIcon icon={faCheck}/>
                    </span> 
                    <span className={validMatch || !matchPass?"hide":"invalid"}>
                        <FontAwesomeIcon icon={faTimes}/>
                    </span>
                </label>

                <input
                    type="password"
                    id="con_pass"
                    onChange={(e)=>setMatchPass(e.target.value)}
                    required
                    aria-invalid={validMatch?"false":"true"}
                    aria-describedby="connote"
                    onFocus={()=>setMatchPass(true)}
                    onBlur={()=>setMatchPass(false)}
                />

                <p id="connote" className={matchFocus && validMatch && !validMatch ? "instructions":"offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle}/>
                    Must match the first password input field.
                </p>

                <button disabled={!validName || !validPass ||!validMatch ?true: false}>Sign Up</button>

            </form>
            <p>Already registered ?<br/>
                    <span className="line">
                        {/*put link to sign in*/}
                        <a href="#">Sign In</a>
                    </span>
            </p>
        </section>
            )}
        </>
    )
}

export default Register;