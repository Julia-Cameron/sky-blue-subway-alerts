import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CreateAccount() {
    const { loginAsUser } = useAuth();

    const navigate = useNavigate();

    function createAccount(e) {
        e.preventDefault();
        loginAsUser();          // Mock login for testing purposes
        navigate("/"); // Redirect to the live feed page after login
    }

    return (
        <div>
            <br></br>
            <div className="registration-container">
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', width: 'fit-content', textAlign: 'center', marginBottom: '16vh' }}>
                    <h1 className='text-buffer'>Join the Community</h1>
                    <img className="registration-image" src="../../public/communityImage.png" alt="Subway Alerts Community Logo" />
                    <p className='text-buffer'>Help riders stay informed together</p>
                </div>

                <div className="card" style={{ width: 'fit-content'}}>
                    <h2>Create Account</h2>
                    <hr></hr>
                    <form onSubmit={createAccount}>
                        <label htmlFor="fullName"><h3>Full Name</h3></label>
                        <input style={{ width: '30vw' }} type="text" id="fullName" name="fullName" placeholder="Your Name" required />

                        <label htmlFor="email"><h3>Email Address</h3></label>
                        <input style={{ width: '30vw' }} type="email" id="email" name="email" placeholder="your.email@example.com" required />

                        <label htmlFor="password"><h3>Password</h3></label>
                        <input style={{ width: '30vw' }} type="password" id="password" name="password" placeholder="Enter at least 8 characters" required />

                        <label htmlFor="confirmPassword"><h3>Confirm Password</h3></label>
                        <input style={{ width: '30vw' }} type="password" id="confirmPassword" name="confirmPassword" placeholder="Re-enter your password" required />

                        <br></br><br></br>
                        <button style={{ display: 'block', margin: 'auto', width: '30vw' }} className="btn primary" type="submit">Create Account</button>
                    </form>
                    <p style={{ textAlign: 'center' }}>Already have an account? <a href="/log-in"><b>Sign-in</b></a></p>
                </div>
            </div>
            
            <br></br>
        </div>
    );
}