import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { LoginIcon, RegisterIcon, LiveFeedIcon, ModeratorIcon, SignOutIcon } from './Icons';
import MyProfile from './MyProfile.jsx';

const PAGE_TITLES = {
    "/": "",
    "/create-account": "Create Account",
    "/log-in": "Log In",
    "/create-report": "Create Report",
    "/edit-report": "Edit Report"
}

export default function HeaderNav() {
    
    const {user, isAuthenticated, logout} = useAuth(); // Get the user and authentication status from AuthContext
    const [isProfileOpen, setIsProfileOpen] = useState(false); // State to manage the visibility of the MyProfile modal

    const location = useLocation(); // Get the current location from react-router-dom
    const pageSuffix = PAGE_TITLES[location.pathname]; // Get the page title based on the current location

    // Function to handle backend when signing out
    function signOut() {
        const decision = confirm("Are you sure you want to sign-out?")
        if (decision) {
            logout(); // Update the context to reflect that the user is signed out
        }
    }

    return (
        <div>
            <div className="banner">
                <h1>Subway Alerts {pageSuffix && `- ${pageSuffix}`}</h1>

                {isAuthenticated ? (
                    <nav>
                        <Link to="/">
                            <button className='btn secondary' style={{ backgroundColor: 'transparent', border: '2px solid #FFFFFF', color: '#FFFFFF' }}>Live Feed</button>
                        </Link>
                        <Link to="/">
                            <button onClick={signOut} className='btn secondary' style={{ backgroundColor: 'transparent', border: '2px solid #FFFFFF', color: '#FFFFFF' }}>Sign-out</button>
                        </Link>
                        
                        <button onClick={() => setIsProfileOpen(true)} className='btn secondary' style={{ backgroundColor: 'transparent', border: '2px solid #FFFFFF', color: '#FFFFFF' }}>Signed-in as: {user?.name}</button>
                        
                    </nav>
                ) : (
                    <nav>
                        <Link to="/">
                            <button className='btn secondary' style={{ backgroundColor: 'transparent', border: '2px solid #FFFFFF', color: '#FFFFFF' }}>Live Feed</button>
                        </Link>
                        <Link to='/create-account'>
                            <button className='btn secondary' style={{ backgroundColor: 'transparent', border: '2px solid #FFFFFF', color: '#FFFFFF' }}>Create an Account</button>
                        </Link>
                        <Link to="/log-in">
                            <button className='btn secondary' style={{ backgroundColor: 'transparent', border: '2px solid #FFFFFF', color: '#FFFFFF' }}>Sign-In</button>
                        </Link>
                    </nav>
                )}
            </div>

            <MyProfile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </div>
    );
}