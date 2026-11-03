import Report from "../components/Report";

export default function LiveFeed() {
    
    return (
        <div>
            <br></br>

            <div style={{ width: 'fit-content', margin: 'auto', textAlign: 'center' }}>
                <h2>All Reports</h2>
                <p>Community updates near you</p>
            </div>
            
            <div className="card" style={{ width: 'fit-content', margin: 'auto' }}>
                <a href="/create-report">
                    <button style={{ display: 'block', margin: 'auto', width: '50vw' }} className="btn primary" type="submit">+ Create Report</button>
                </a>
            </div>
            <br></br>

            <Report
                key={1}
                line={2}
                station={"Testing Station 1"}
                description={"Down"}
            />

            <Report
                key={2}
                line={1}
                station={"Testing Station 2"}
                description={"Delayed"}
            />
        
        </div>
    );
}