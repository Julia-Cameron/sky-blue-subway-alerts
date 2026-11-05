import React from 'react';
import { Link } from 'react-router-dom';

export default function HeaderNav() {
    return (
        <div>
            <h1>Subway Alerts</h1>
            <nav>
                <Link to="/" className="btn secondary">Login</Link> 
                <Link to="/create-account" className="btn secondary"> Create Account</Link>
                <Link to="/live-feed" className="btn secondary"> Live Feed</Link> 
                <Link to="/moderator-view" className="btn secondary"> Moderator View (Temporary)</Link>
            </nav>
        </div>
    );
}