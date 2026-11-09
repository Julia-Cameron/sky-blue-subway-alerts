export default function CreateAccount() {
    return (
        <div>
            <br></br>

            <div style={{ width: 'fit-content', margin: 'auto', textAlign: 'center' }}>
                <h2>Join the Community</h2>
                <p>Help riders stay informed together</p>
            </div>

            <div className="card" style={{ width: 'fit-content', margin: 'auto' }}>
                <h2>Create Account</h2>
                <hr></hr>
                <form>
                    <label htmlFor="fullName"><h3>Full Name</h3></label>
                    <input style={{ width: '50vw' }} type="text" id="fullName" name="fullName" placeholder="Your Name" required />

                    <label htmlFor="email"><h3>Email Address</h3></label>
                    <input style={{ width: '50vw' }} type="email" id="email" name="email" placeholder="your.email@example.com" required />

                    <label htmlFor="password"><h3>Password</h3></label>
                    <input style={{ width: '50vw' }} type="password" id="password" name="password" placeholder="Enter at least 8 characters" required />

                    <label htmlFor="confirmPassword"><h3>Confirm Password</h3></label>
                    <input style={{ width: '50vw' }} type="password" id="confirmPassword" name="confirmPassword" placeholder="Re-enter your password" required />

                    <br></br><br></br>
                    <button style={{ display: 'block', margin: 'auto', width: '30vw' }} className="btn primary" type="submit">Create Account</button>
                </form>
                <p style={{ textAlign: 'center' }}>Already have an account? <a href="/"><b>Sign in</b></a></p>
            </div>

            <br></br>
        </div>
    );
}