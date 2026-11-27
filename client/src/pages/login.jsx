import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const { loginAsUser } = useAuth();

    const navigate = useNavigate();

    function signIn(e) {
        e.preventDefault(); // Prevent the default form submission behavior
        loginAsUser();          // Mock login for testing purposes
        navigate("/"); // Redirect to the live feed page after login
    }

    return (
        <div>
            <br />
            <br />
            <div className="login-container">
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', width: 'fit-content', textAlign: 'center' }}>
                    <h2 className="text-buffer">Welcome to</h2>
                    <img className="login-image" src="../../public/loginImage.png" alt="Subway Alerts Logo" />
                    <h1 className="text-buffer">Subway Alerts</h1>
                    <p className="text-buffer">Sign-in to view the live feed and your reports</p>
                </div>
                
                <div className="card" style={{ width: 'fit-content'}}>
                    <h2>Login</h2>
                    <hr></hr>
                    <form onSubmit={signIn}>
                        <label htmlFor="email"><h3>Email Address</h3></label>
                        <input style={{ width: '30vw' }} type="email" id="email" name="email" placeholder="your.email@example.com" required />

                        <label htmlFor="password"><h3>Password</h3></label>
                        <input style={{ width: '30vw' }} type="password" id="password" name="password" placeholder="Enter your password" required />

                        <br></br><br></br>
                        <button style={{ display: 'block', margin: 'auto', width: '30vw' }} className="btn primary" type="submit">Login</button>
                    </form>

                    <p style={{ textAlign: 'center' }}>New to Subway Alerts? <a href="/create-account"><b>Create an account</b></a></p>
                </div>
            </div>
            
            <br />
            <br />
            <br />
            <br />
        </div>
    );
}