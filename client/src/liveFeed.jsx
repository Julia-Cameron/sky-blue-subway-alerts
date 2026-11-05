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

            {/* 
                THE BELOW WILL BE REPLACED WITH A MAP FUNCTION THAT RENDERS ALL REPORTS FROM THE DATABASE 
                1. Get and store list of reports from DB with useEffect and useState
                2. Map through the list and render a Report component for each report
            */}
            <Report 
                title="Delayed at Main Street"
                description="No service, shuttle busses are running."
                lineNumber="2"
                lineStation="Line 2 Bloor - Danforth"
                date="2024-06-01"
                userOwnsThis={false}
                confirmedCount={5}
            />
            <Report 
                title="Signal problem at Bloor-Yonge"
                description="Signal problem, trains holding at the platform."
                lineNumber="1"
                lineStation="Line 1 Yonge - University"
                date="2024-06-02"
                userOwnsThis={true}
                confirmedCount={3}
            />
        
        </div>
    );
}