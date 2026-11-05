import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function EditReport() {
    // Used to auto-populate the form fields with the report's data passed as state from the LiveFeed page
    const location = useLocation();
    const navigate = useNavigate();

    const reportData = location.state || {};

    // Values retrieved from the reportData object to pre-populate the form fields. If no data is passed, default to empty strings.
    const [title, setTitle] = useState(reportData.title || "");
    const [description, setDescription] = useState(reportData.description || "");
    const [lineNumber, setLineNumber] = useState(reportData.lineNumber || "");
    const [lineStation, setLineStation] = useState(reportData.lineStation || "");

    function handleSaveChanges() {
        e.preventDefault();
        // INSERT BACKEND UPDATE METHOD HERE
        // ALSO UPDATE DATE AND TIME UPON SAVING NEW CHANGES
        navigate("/live-feed");
    };

    function handleDeleteReport() {
        e.preventDefault();
        // INSERT BACKEND DELETE METHOD HERE
        navigate("/live-feed");
    }

    return (
        <div>
            <br></br>

            <div className="card" style={{ width: 'fit-content', margin: 'auto' }}>
                <h2>Edit Report</h2>
                <hr></hr>
                
                <form>
                    {/* Everything same as the CreateReport form but pre-populated with the report's data and with a "Save Changes" button instead of "Submit Report" */}
                    <label htmlFor="title"><h3>Title</h3></label>
                    <input style={{ width: '50vw' }} type="text" id="title" name="title" placeholder={title} value={title} onChange={(e) => setTitle(e.target.value)} required />
                    
                    <label htmlFor="line"><h3>Line</h3></label>
                    <select style={{ width: '52vw' }} id="line" name="line" value={lineStation} onChange={(e) => setLineNumber(e.target.value)} required>
                        <option value={lineNumber}>{lineStation}</option>
                        <option value="1">Line 1</option>
                        <option value="2">Line 2</option>
                        <option value="4">Line 4</option>
                        <option value="5">Line 5</option>
                        <option value="6">Line 6</option>
                    </select>

                    <label htmlFor="station"><h3>Station</h3></label>
                    <select style={{ width: '52vw' }} id="station" name="station" value={lineStation} onChange={(e) => setLineStation(e.target.value)} required>
                        <option value={lineNumber}>{lineStation}</option>
                        <option value="Station 1">Station 1</option>
                        <option value="Station2">Station 2</option>
                        <option value="Station 4">Station 4</option>
                        <option value="Station 5">Station 5</option>
                        <option value="Station 6">Station 6</option>
                    </select>

                    <label htmlFor="description"><h3>What happened?</h3></label>
                    <textarea style={{ width: '50vw' }} id="description" name="description" placeholder={description} value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>

                    <br />

                    <button onClick={handleSaveChanges} className="btn primary" style={{ display: 'block', margin: '16px auto', width: '50vw' }}>Save Changes</button>
                </form>
                <a href="/live-feed"><button className="btn secondary" style={{ display: 'block', margin: '16px auto', width: '50vw' }}>Cancel Edits</button></a>
                {/* Delete button that allows the user to delete the report and return to the live feed page */}
                <button type="button" onClick={handleDeleteReport} className="btn delete" style={{ display: 'block', margin: '16px auto', width: '50vw' }}>Delete Report</button>
            </div>
            <p style={{ margin: '16px auto', width: 'fit-content' }}>Share accurate and respectful updates. Do not include personal information.</p>
        </div>
    );
}