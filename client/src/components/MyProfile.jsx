import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function MyProfile({ isOpen, onClose }) {
    const { user, updateUser, deleteAccount } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const [isDeleting, setIsDeleting] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteError, setDeleteError] = useState('');

    useEffect(() => {
        if (user && isOpen) {
            setName(user.name);
            setEmail(user.email);

            setIsDeleting(false);
            setDeletePassword('');
            setDeleteError('');
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

    function handleConfirmDelete() {
        if (deletePassword === user.password) {
            deleteAccount();
            onClose();
        } else {
            setDeleteError('Incorrect password. Please try again.');
        }
    }

    function handleCancelDelete() {
        setIsDeleting(false);
        setDeletePassword('');
        setDeleteError('');
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

                    <br /><button style={{ marginBottom: '10px' }} type="submit" className="btn primary" disabled={!hasChanges}>Confirm Edits</button>

                    {!isDeleting ? (
                        <button type="button" className="btn delete" onClick={() => setIsDeleting(true)}>Delete Account</button>
                    ) : (
                        <>
                            <label htmlFor="delete-password"><h3>Confirm Password to Delete Your Account</h3></label>
                            <input style={{ width: '30vw', marginBottom: '10px' }} type="password" id="delete-password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} required />
                            <br />
                            {deleteError && <p style={{ color: 'red' }}>{deleteError}</p>}
                            <button style={{ marginBottom: '10px' }} type="button" className="btn delete" onClick={handleConfirmDelete}>Confirm Delete</button>
                            <button type="button" className="btn secondary" onClick={handleCancelDelete}>Cancel</button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}