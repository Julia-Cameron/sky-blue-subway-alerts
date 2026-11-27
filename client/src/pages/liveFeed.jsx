import Report from "../components/Report";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LiveFeed() {

    const { isAuthenticated } = useAuth(); // Get the user and authentication status from AuthContext
    
    return (
        <div>
            <br></br>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'fit-content', margin: 'auto', textAlign: 'center' }}>
                <h2 className="text-buffer">All Reports</h2>
                <p className="text-buffer">Community updates near you</p>
            </div>
            
            {isAuthenticated ? (
                <Link to="/create-report">
                    <button style={{ display: 'block', margin: '16px auto', width: '30vw' }} className='btn secondary'>+ Create Report</button>
                </Link>
            ) : (
                <Link to="/log-in">
                    <button style={{ display: 'block', margin: '16px auto', width: '30vw' }} className='btn secondary'>Sign in to Create Report</button>
                </Link>
            )}
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