import React, { useState } from 'react';
import './CSS/Auth.css';
import axios from "axios"
const Auth = () => {
  const [active, setActive] = useState(false);

  const toggleForm = () => {
    setActive(!active);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const email = event.target.email.value
    const password = event.target.password.value
    if (localStorage.getItem('id')){
      alert('You are already Login')
    }
    
    else{
        try {
        const response = await axios.post('http://localhost:8000/auth/login/', { email, password });
        const {refresh,id,user_type} = response.data;
        localStorage.setItem('authToken',refresh)
        localStorage.setItem('id',id)
        localStorage.setItem('type',user_type)
        console.log(response.data)
        alert('Login Successful')
    } catch (error) {
        console.error('Login failed', error);
        alert('Login UnSuccessful')
    }
    }
    event.target.email.value=''
    event.target.password.value=''
}

const handleRegister = async (event) => {
    event.preventDefault();
    const username = event.target.username.value
    const email = event.target.email.value
    const password = event.target.password.value
    const user_type = event.target.type.value
    try {
        const response = await axios.post('http://localhost:8000/auth/register/', { 'username': username, 'email': email, 'password': password,'type':user_type})
        if (response.data['message'] == 'unSuccessful') {
            console.log('Error');
            alert('Register UnSuccessful')
        }
        else {
            console.log('Success');
            alert('Register Successful')
        }

        console.log(response);
    }
    catch (error) {
      alert('Register UnSuccess')
        console.error(error);
    }
    event.target.username.value=''
    event.target.email.value=''
    event.target.password.value=''
    event.target.user_type=''
}

  return (
    <div className={`wrapper ${active ? 'active' : ''}`}>
      {/* Login Form */}
      <div className="form-wrapper login">
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <div className="input-box">
            <span className="icon">
              <ion-icon name="mail"></ion-icon>
            </span>
            <input type="email" name='email' placeholder="Email" required />
          </div>
          <div className="input-box">
            <span className="icon">
              <ion-icon name="lock-closed"></ion-icon>
            </span>
            <input type="password" name='password' placeholder="Password" required />
          </div>
          <button className='btn' type="submit">Login</button>
          <div className="sign-link">
            <p>
              Don't have an account?{' '}
              <a href="#" onClick={toggleForm}>
                Register
              </a>
            </p>
          </div>
        </form>
      </div>

      {/* Registration Form */}
      <div className="form-wrapper register">
        <form onSubmit={handleRegister}>
          <h2>Registration</h2>
          <div className="input-box">
            <span className="icon">
              <ion-icon name="person"></ion-icon>
            </span>
            <input type="text" name='username' placeholder="User Name" required />
          </div>
          <div className="input-box">
            <span className="icon">
              <ion-icon name="mail"></ion-icon>
            </span>
            <input type="email" name='email' placeholder="Email" required />
          </div>

          <div className="input-box">
            <span className="icon">
              <ion-icon name="lock-closed"></ion-icon>
            </span>
            <input type="password" name='password' placeholder="Password" required />
          </div>

          <div className="input-box">
            <label><input type="radio" id='type' name='type' value="client"/>Client</label>
            <label><input type="radio" id='type' name='type' value="agent"/>Agent</label>
          </div>

          <button type="submit" className='btn'>Register</button>
          <div className="sign-link">
            <p>
              Already have an account?{' '}
              <a href="#" onClick={toggleForm}>
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;