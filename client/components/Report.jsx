import { useState } from "react";

export default function Report({ line, station, description }) {
    const [stillHappening, setStillHappening] = useState(0);
    const [alreadyClicked, setAlreadyClicked] = useState(false);

    function handleStillHappening() {
        if (alreadyClicked) {
            return;
        }
        setStillHappening((count) => count + 1);
        setAlreadyClicked(true);
    }

    return (
        <div className="card" style={{ width: 'fit-content', margin: 'auto', marginBottom: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', height: 'fit-content', width: '50vw' }}>
                <div className="line" style={{ marginRight: '64px' }}>{line}</div>
                <div style={{ alignSelf: 'center', width: '50vw' }}>
                    <b>{station}</b>
                    <p>{description}</p>
                </div>
                <span className="chip bad" style={{ height: 'fit-content', marginTop: '16px' }}>Active</span>
            </div>
            <button className="btn primary" style={{ display: 'block', width: '50vw', marginBottom: '8px' }} onClick={handleStillHappening}>Still Happening: {stillHappening} Confirmed</button>
            <a href="/edit-report"><button className="btn secondary" style={{ display: 'block', width: '50vw' }}>Edit Report</button></a>
        </div>
    );
}