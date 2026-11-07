import React from 'react';
import { href, Link } from 'react-router-dom';
import { useState } from 'react';
import { useEffect} from 'react';
import { LoginIcon, RegisterIcon, LiveFeedIcon, ModeratorIcon, SignOutIcon } from './Icons';

export default function HeaderNav() {
    const [isOpen, setIsOpen] = useState(false);        // Check if the sidebar is open
    const [isSignedIn, setSignedIn] = useState(true);   // Check if the user is signed in

    // Function used to close the sidebar with just pressing 'ESC' on the keyboard while it is open
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape" || e.code === "Escape") {
                if (isOpen) {
                    setIsOpen(false);
                }
            }
        };

        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen]);

    // Function to handle backend when signing out
    function signOut() {
        const decision = confirm("Are you sure you want to sign-out?")
        if (decision) {
            // INSERT BACKEND CODE HERE
            setSignedIn(false);
        }
    }

    return (
        <div>
            <h1 className="banner">Subway Alerts</h1>
            <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>☰</button>

            <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-content">
                    {isSignedIn ? (
                        <h3 onClick={signOut} className='custom-link'><SignOutIcon />Sign-Out</h3>
                        ) : (
                            <h3><Link to="/" className='custom-link'><LoginIcon />Login</Link></h3>
                        )
                    }
                    <h3><Link to="/create-account" className='custom-link'><RegisterIcon />Create Account</Link></h3>
                    <h3><Link to="/live-feed" className='custom-link'><LiveFeedIcon />Live Feed</Link></h3>
                    <h3><Link to="/moderator-view" className='custom-link'><ModeratorIcon />Moderator View (TMP)</Link></h3>
                    {isSignedIn ? (
                            <a href='/create-account'>
                                <button className='btn secondary' style={{position: "absolute", bottom: '16px', marginRight: '1vw'}}>Create a Report</button>
                            </a>
                        ) : (
                            <a href="/">
                                <button className='btn secondary' style={{position: "absolute", bottom: '16px', marginRight: '1vw'}}>Sign-in to Make a Report</button>
                            </a>
                        )
                    }
                </div>
            </aside>
        </div>
    );
}