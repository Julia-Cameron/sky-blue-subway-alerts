import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '10s', target: 5 },   // Ramp up to 5 concurrent users for safety
        { duration: '20s', target: 10 },  // Hold at 10 concurrent users
        { duration: '10s', target: 0 },   // Ramp down
    ],
    thresholds: {
        http_req_failed: ['rate<0.01'],   // Error rate must be under 1%
        http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    },
};

const BASE_URL = 'http://localhost:3000/api';

// --- SETUP STAGE: Runs ONCE before the test starts to fetch a shared JWT token ---
export function setup() {
    const loginPayload = JSON.stringify({
        email: 'alex@ttc.ca', // Replace with a valid test user in your DB
        password: 'alex@123',
    });

    const loginRes = http.post(`${BASE_URL}/auth/login`, loginPayload, {
        headers: { 'Content-Type': 'application/json' },
    });

    check(loginRes, {
        'login successful (200)': (r) => r.status === 200,
        'token received': (r) => r.json('token') !== undefined,
    });

    // Extract the token from the login response body
    const token = loginRes.json('token');
    return { token: token };
}

// --- VU EXECUTION STAGE: Runs repeatedly for each virtual user ---
export default function (data) {
    const authToken = data.token;
    
    // Define standard headers including the Bearer token
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
    };

    // 1. POST Request: Create a new resource (e.g., a transit delay report)
    const postPayload = JSON.stringify({
        lineId: '6aea17f74524a69eb7a85651', // Use a valid line ID from your seeder
        issue: 'Severe signal delay test',
        station: 'Bloor-Yonge',
    });

    const postRes = http.post(`${BASE_URL}/reports`, postPayload, { headers: headers });
    
    const isPostCreated = check(postRes, {
        'POST status is 201 or 200': (r) => r.status === 201 || r.status === 200,
    });

    sleep(1);

    // Only proceed with PUT and DELETE if the resource was successfully created and we have an ID
    if (isPostCreated) {
        // Safely extract the created resource ID (adjust 'report._id' to match your API response structure)
        const reportId = postRes.json('report._id') || postRes.json('_id');

        if (reportId) {
            // 2. PUT Request: Update the created resource
            const putPayload = JSON.stringify({
                issue: 'Updated delay description under load test',
            });

            const putRes = http.put(`${BASE_URL}/reports/${reportId}`, putPayload, { headers: headers });
            check(putRes, {
                'PUT status is 200': (r) => r.status === 200,
            });

            sleep(1);

            // 3. DELETE Request: Clean up/delete the resource
            const deleteRes = http.del(`${BASE_URL}/reports/${reportId}`, null, { headers: headers });
            check(deleteRes, {
                'DELETE status is 200 or 204': (r) => r.status === 200 || r.status === 204,
            });
        }
    }

    sleep(1);
}