import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Report({ title, description, lineNumber, lineStation, date, userOwnsThis, confirmedCount }) {
    const [stillHappening, setStillHappening] = useState(confirmedCount);
    const [alreadyClicked, setAlreadyClicked] = useState(false);
    const userOwned = userOwnsThis;

    const navigate = useNavigate(); // Initialize the navigate function

    // Handle the "Still Happening" button click and ensures that the user can only click it once per report
    function handleStillHappening() {
        if (alreadyClicked) {
            return;
        }
        setStillHappening((count) => count + 1);
        setAlreadyClicked(true);
    }

    // Handle the "Edit Report" button click which sends the user to the edit report page with the report's data passed as state
    function handleEditReport() {
        navigate("/edit-report", { state: { title, description, lineNumber, lineStation, date } });
    };

    return (
        <div className="card" style={{ width: 'fit-content', margin: 'auto', marginBottom: '16px' }}>
            {/* Render the report's information Line -> Title -> OwnsThis? -> Description -> Line Station -> Date */}
            <div style={{ display: 'flex', flexDirection: 'row', height: 'fit-content', width: '50vw' }}>
                <div className="line" style={{ marginRight: '64px' }}>{lineNumber}</div>

                <div style={{ alignSelf: 'center', width: '50vw' }}>
                    <b>{title}</b><br></br>
                    {userOwnsThis ? (
                        <span className="chip yours" style={{ height: 'fit-content', marginTop: '16px' }}>Your report</span>
                    ) : null}
                    <p>{description}</p>
                    <p>{lineStation}</p>
                    <p>Reported {date}</p>
                </div>
                
                {/* Indicates whether the report is still active or not */}
                <span className="chip bad" style={{ height: 'fit-content', marginTop: '16px' }}>Active</span>
            </div>
            
            {/* Render the "Still Happening" button for all signed-in users and the "Edit Report" button if the user owns the report */}
            <button className="btn primary" style={{ display: 'block', width: '50vw', marginBottom: '8px' }} onClick={handleStillHappening}>Still Happening {stillHappening}</button>
            {userOwnsThis ? (
                <button className="btn secondary" style={{ display: 'block', width: '50vw' }} onClick={handleEditReport}>Edit Report</button>
            ) : null}
        </div>
    );
}