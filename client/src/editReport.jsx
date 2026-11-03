export default function EditReport() {
    return (
        <div>
            <br></br>

            <div className="card" style={{ width: 'fit-content', margin: 'auto' }}>
                <h2>Edit Report</h2>
                <hr></hr>
                
                <form>
                    <label htmlFor="line"><h3>Line</h3></label>
                    <select style={{ width: '52vw' }} id="line" name="line" required>
                        <option value="">Select a line</option>
                        <option value="1">Line 1</option>
                        <option value="2">Line 2</option>
                        <option value="4">Line 4</option>
                        <option value="5">Line 5</option>
                        <option value="6">Line 6</option>
                    </select>

                    <label htmlFor="station"><h3>Station</h3></label>
                    <input style={{ width: '50vw' }} type="text" id="station" name="station" placeholder="Enter station name" required />

                    <label htmlFor="description"><h3>What happened?</h3></label>
                    <textarea style={{ width: '50vw' }} id="description" name="description" placeholder="Describe the issue" required></textarea>

                    <br />

                    <button className="btn primary" style={{ display: 'block', margin: '16px auto', width: '50vw' }}>Save Changes</button>
                </form>
                <a href="/live-feed"><button className="btn secondary" style={{ display: 'block', margin: '16px auto', width: '50vw' }}>Cancel Edits</button></a>
            </div>
            <p style={{ margin: '16px auto', width: 'fit-content' }}>Share accurate and respectful updates. Do not include personal information.</p>
        </div>
    );
}