import { useState, useRef, useContext } from "react";
import AuthContext from "../store/auth-context";
import classes from "./AuthForm.module.css";
import { useHistory } from 'react-router-dom';


const AuthForm = () => {
  const history = useHistory()
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const authCtx = useContext(AuthContext)
  const [isLogin, setIsLogin] = useState(true);
  const [showError, setShowError] = useState("");
  const [signupInProgress, setSignupInProgress] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState("");

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    

    // optional: Add validation
    let url;
    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAvUxVH0Ni67C82Vw4H6UR4wHCan2vbG_A";
    } else {
      url =
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAvUxVH0Ni67C82Vw4H6UR4wHCan2vbG_A";
      setSignupInProgress(true); // set signup in progress
      setSignupSuccess(""); // reset signup success message
      setShowError(""); // reset error message
    }
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          if(!isLogin){
            setSignupSuccess("Signup Successful, you may login");
          }
          setShowError("");
          return res.json()
        } else {
          return res.json().then((data) => {
            setShowError(data.error.message);
            let errorMessage = 'Authentication Failed'
            throw new Error(errorMessage)
          });
        }
      }).then((data) => {
        // console.log(data)
        authCtx.login(data.idToken)
        history.replace('/')
      }).catch((err) => {
        alert(err.message)
      }
      )
      .finally(() => {
        setSignupInProgress(false); // reset signup in progress
      });
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          {signupInProgress ? (
            <button type="button" className={classes.btn}>
              Signup in progress...
            </button>
          ) : (
            <button type="submit" className={classes.btn}>
              {isLogin ? "Login" : "Sign Up"}
            </button>
          )}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
          {showError && <div style={{ color: "white" }}>{showError}</div>}
          {signupSuccess && (
            <div style={{ color: "white" }}>{signupSuccess}</div>
          )}
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
