import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { House, HousePlus, Search, UserRound } from "lucide-react";
import { Link } from 'react-router-dom'
import './CSS/Navbar.css'
import Home from "./Home"
import Auth from "./Auth"
import Add from "./Add";
import Listing from "./Listing";
import HD from "./HD";
import Profile from "./Profile";
import axios from "axios";


function Navbar() {
    const [isLogin, setLogin] = useState(false)
    const [token,setToken]=useState('')
    let userid=localStorage.getItem('id');
    
    useEffect(() => {
        setToken(localStorage.getItem('authToken'));
        if (token) {
            setLogin(true)
        }
        else {
            setInterval(()=>{
                setToken(localStorage.getItem('authToken'))
            },1000)
            setLogin(false)
        }
    },[token])

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('authToken');

            if (token) {
                await axios.post('http://localhost:8000/auth/logout/', {'token':token});

                localStorage.removeItem('authToken');
                localStorage.removeItem('id');
                localStorage.removeItem('type');
                delete axios.defaults.headers.common['Authorization'];

                console.log('Successfully logged out');
                setLogin(false)
            } else {
                console.error('No token found');
            }
        } catch (error) {
            console.error('Logout failed', error);
        }
    }

    return (
        <Router>
            <div className="navbar">
                <div className="logo">
                    <a href="/"><img src="../logo.jpg" style={{height:'64px',width:'64px',border:'12px'}} alt="" /></a>
                </div>

                <div className="navitem">
                    <Link to='/'><p>Home</p></Link>
                    <Link to='/listing'><p>Listing</p></Link>
                    <Link to='/add'><p>Add Property</p></Link>
                </div>

                <div className="logsign">
                    {!userid && (<div><Link to='/auth' id="auth">Login</Link></div>)}
                    {userid && (<div><Link to={`/profile/${userid}`}><UserRound/></Link><button id="auth" onClick={handleLogout}>Logout</button></div>)}
                </div>
            </div>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="listing" element={<Listing />} />
                <Route path="add" element={<Add />} />
                <Route path="auth" element={<Auth />} />
                <Route path="/property/:id" element={<HD />} />
                <Route path='/profile/:id' element={<Profile />} />
            </Routes>
        </Router>
    );
}

export default Navbar;