import { useRef, useContext, useState } from 'react';
import classes from './ProfileForm.module.css';
import AuthContext from '../store/auth-context';

const ProfileForm = () => {
  const [showError, setShowError] = useState('')
  const authCtx = useContext(AuthContext)
  
  const newPasswordInputRef = useRef()
  const submitHandler = e => {
    e.preventDefault()
    const enteredNewPassword = newPasswordInputRef.current.value;
    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAvUxVH0Ni67C82Vw4H6UR4wHCan2vbG_A',{
      method: 'POST',
      body: JSON.stringify({
        idToken: authCtx.token,
        password: enteredNewPassword,
        returnSecureToken: false,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if(res.ok){
        setShowError('password changed successfully')
      }
      else{
        return res.json().then(data =>{
          // console.log(data)
          setShowError(data.error.message)
        })
      }
      
    })
  }

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' ref={newPasswordInputRef}/>
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
      <div>{showError}</div>
    </form>
  );
}

export default ProfileForm;
