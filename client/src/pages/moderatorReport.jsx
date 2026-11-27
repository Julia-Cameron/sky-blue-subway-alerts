import { useState } from "react";

export default function ModeratorReport({ line, station, description }) {
    const [resolved, setResolved] = useState("Active");
    const [color, setColor] = useState("bad");
    const [visible, setVisible] = useState(true);
    const [lineColor, setLineColor] = useState("line");

    function handleResolved() {
        setResolved("Resolved");
        setColor("ok");
        setLineColor("line done");
    }

    function handleDelete() {
        const decision = confirm("Are you sure you want to delete this report?");
        if (decision) {
            // INSERT BACKEND DELETE METHOD HERE
            setVisible(false);
        }
    }

    return (
        <div>
            {visible ? (
                <div className="card" style={{ width: 'fit-content', margin: 'auto', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', height: 'fit-content', width: '50vw' }}>
                        <div className={lineColor} style={{ marginRight: '64px' }}>{line}</div>
                        <div style={{ alignSelf: 'center', width: '50vw' }}>
                            <b>{station}</b>
                            <p>{description}</p>
                        </div>
                        <span className={`chip ${color}`} style={{ height: 'fit-content', marginTop: '16px' }}>{resolved}</span>
                    </div>
                    <button className="btn primary" style={{ display: 'block', width: '50vw', marginBottom: '8px' }} onClick={handleResolved}>Mark Resolved</button>
                    <button className="btn delete" style={{ display: 'block', width: '50vw' }} onClick={handleDelete}>Delete Report</button>
                </div>
                ) : null}
        </div>
        
    );
}