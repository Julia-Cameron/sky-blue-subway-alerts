import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '15s', target: 200 },   // Ramp up to 200 users over 15s
        { duration: '30s', target: 500 },   // Ramp up to 500 users over 30s
        { duration: '30s', target: 1000 },  // Spike up to 1,000 concurrent users for 30s
        { duration: '20s', target: 200 },   // Ramp down to 200 users
        { duration: '10s', target: 0 },     // Cool down to 0
    ],
    thresholds: {
        http_req_duration: ['p(95)<1000'], // Allowing up to 1s under extreme 1k user load
        http_req_failed: ['rate<0.05'],   // Allowing up to 5% error rate at peak stress
    },
};

const BASE_URL = 'http://localhost:3000/api';

export default function () {
    const linesRes = http.get(`${BASE_URL}/transit/lines`);
    check(linesRes, {
        'lines status is 200': (r) => r.status === 200,
    });

    sleep(0.5); // Shorter sleep to increase request frequency per user

    const reportsRes = http.get(`${BASE_URL}/reports`);
    check(reportsRes, {
        'reports status is 200': (r) => r.status === 200,
    });

    sleep(0.5);
}