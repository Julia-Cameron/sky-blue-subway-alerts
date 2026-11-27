import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function MyProfile({ isOpen, onClose }) {
    const { user, updateUser, deleteAccount } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (user && isOpen) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user, isOpen]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        }
    }, [isOpen]);

    if (!isOpen || !user ) return null;

    const hasChanges = name.trim() !== user.name || email.trim() !== user.email;

    function handleConfirmEdits(e) {
        e.preventDefault();

        if (!hasChanges) return;
        
        updateUser({ name: name.trim(), email: email.trim() });

        onClose();
    }

    function handleDeleteAccount() {
        const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
        if (confirmed) {
            deleteAccount();
            onClose();
        }
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="card" style={{ width: 'fit-content' }} onClick={(e) => e.stopPropagation()}>
                <h2>Your Account</h2>
                <form className="profile-form" onSubmit={handleConfirmEdits}>
                    <label htmlFor="name"><h3>Name</h3></label>
                    <input style={{ width: '30vw' }} type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />

                    <label htmlFor="email"><h3>Email</h3></label>
                    <input style={{ width: '30vw' }} type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                    <br />

                    <br /><button type="submit" className="btn primary" disabled={!hasChanges}>Confirm Edits</button>
                    <br /><button type="button" className="btn delete" onClick={handleDeleteAccount}>Delete Account</button>
                </form>
            </div>
        </div>
    );
}