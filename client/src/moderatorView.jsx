import ModeratorReport from "../components/ModeratorReport";

export default function ModeratorView() {
    
    return (
        <div>
            <br></br>

            <div style={{ width: 'fit-content', margin: 'auto', textAlign: 'center' }}>
                <h2>Moderator Tools</h2>
                <p>Account access confirmed. Review reports and update their status.</p>
            </div>
            
            <ModeratorReport
                key={1}
                line={2}
                station={"Testing Station 1"}
                description={"Down"}
            />

            <ModeratorReport
                key={2}
                line={1}
                station={"Testing Station 2"}
                description={"Delayed"}
            />
        
        </div>
    );
}