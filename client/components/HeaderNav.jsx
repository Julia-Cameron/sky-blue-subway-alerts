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
                {/* Temporary }
                <Link to="/create-report" className="btn secondary"> Create Report</Link>
                <Link to="/edit-report" className="btn secondary"> Edit Report</Link>
                */}
                <Link to="/moderator-view" className="btn secondary"> Moderator View (Temporary)</Link>
            </nav>
        </div>
    );
}