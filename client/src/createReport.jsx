import { useState } from "react";

export default function CreateReport() {
    const [formData, setFormData] = useState({line: '', station: '', description: ''});

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            // RELPLACE WITH ACTUAL BACKEND IMPLEMENTATION
            window.parent.postMessage(JSON.stringify(formData), '*');
            console.log("Sending Report: ", JSON.stringify(formData));
            alert("Successfully submitted report!");
        } catch (error) {
            alert("Something went wrong.");
        }
    }

    return (
        <div>
            <br></br>

            <div className="card" style={{ width: 'fit-content', margin: 'auto' }}>
                <h2>Create Report</h2>
                <hr></hr>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="line"><h3>Line</h3></label>
                    <select style={{ width: '52vw' }} id="line" name="line" required value={formData.line} onChange={(e) => setFormData({...formData, line: e.target.value})}>
                        <option value="">Select a line</option>
                        <option value="1">Line 1</option>
                        <option value="2">Line 2</option>
                        <option value="4">Line 4</option>
                        <option value="5">Line 5</option>
                        <option value="6">Line 6</option>
                    </select>

                    <label htmlFor="station"><h3>Station</h3></label>
                    <input style={{ width: '50vw' }} type="text" id="station" name="station" placeholder="Enter station name" required value={formData.station} onChange={(e) => setFormData({ ...formData, station: e.target.value })}/>

                    <label htmlFor="description"><h3>What happened?</h3></label>
                    <textarea style={{ width: '50vw' }} id="description" name="description" placeholder="Describe the issue" required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>

                    <br />

                    <button className="btn primary" style={{ display: 'block', margin: '16px auto', width: '50vw' }}>Submit Report</button>
                </form>
            </div>

            <p style={{ margin: '16px auto', width: 'fit-content' }}>Share accurate and respectful updates. Do not include personal information.</p>
        </div>
    );
}