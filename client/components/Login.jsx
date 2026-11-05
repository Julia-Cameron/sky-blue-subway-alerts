export default function Login() {
    return (
        <div>
            <br></br>

            <div style={{ width: 'fit-content', margin: 'auto', textAlign: 'center' }}>
                <h2>Welcome to Subway Alerts</h2>
                <p>Sign-in to view the live feed and your reports</p>
            </div>
            
            <div className="card" style={{ width: 'fit-content', margin: 'auto' }}>
                <h2>Login</h2>
                <hr></hr>
                <form>
                    <label htmlFor="email"><h3>Email Address</h3></label>
                    <input style={{ width: '50vw' }} type="email" id="email" name="email" placeholder="your.email@example.com" required />

                    <label htmlFor="password"><h3>Password</h3></label>
                    <input style={{ width: '50vw' }} type="password" id="password" name="password" placeholder="Enter your password" required />

                    <br></br><br></br>
                    <button style={{ display: 'block', margin: 'auto', width: '30vw' }} className="btn primary" type="submit">Login</button>
                </form>

                <p style={{ textAlign: 'center' }}>New to Subway Alerts? <a href="/create-account"><b>Create an account</b></a></p>
            </div>

            <br></br>
        </div>
    );
}