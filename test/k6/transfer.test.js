import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Trend } from 'k6/metrics';
import { getBaseUrl } from './helpers/getBaseUrl.js';
import { randomName, registerUser, loginUser } from './helpers/utils.js';

// Test options: 10 virtual users for 15 seconds and threshold for p95
export let options = {
//   vus: 10,
//   duration: '15s',
  thresholds: {
    // percentil 95 deve ser menor que 2000ms
    'http_req_duration': ['p(95)<2000'],
  },
  stages: [
    { duration: '3s', target: 10 }, // ramp up to 10 users
    { duration: '15s', target: 10 },  // stay at 10 users
    { duration: '2s', target: 100 },   // Spike to 100 users
    {duration: '5s', target: 0 }   // ramp down to 0 users
  ],
};

// Trend to monitor POST /transfer durations
export const transferTrend = new Trend('transfer_duration');

export default function () {
  const base = getBaseUrl();
  let usernameFrom = null;
  let usernameTo = null;
  const password = 'Pass@1234';

  group('register two users', function () {
    usernameFrom = randomName();
    usernameTo = randomName();

    const res1 = registerUser(usernameFrom, password, false);
    // Try to extract username from response if available (data.username)
    try {
      const body1 = res1.json ? res1.json() : {};
      if (body1 && body1.data && body1.data.username) {
        usernameFrom = body1.data.username;
      }
    } catch (e) {
      // ignore parse errors
    }

    const res2 = registerUser(usernameTo, password, true);
    try {
      const body2 = res2.json ? res2.json() : {};
      if (body2 && body2.data && body2.data.username) {
        usernameTo = body2.data.username;
      }
    } catch (e) {
      // ignore parse errors
    }
  });

  group('login and transfer', function () {
    const loginRes = loginUser(usernameFrom, password);
    // Prepare headers. If token present, attach Authorization header.
    const headers = { 'Content-Type': 'application/json' };
    try {
      const loginBody = loginRes.json ? loginRes.json() : {};
      // Try common token fields
      const token = loginBody && (loginBody.token || loginBody.accessToken || (loginBody.data && (loginBody.data.token || loginBody.data.accessToken)));
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (e) {
      // ignore
    }

    const amount = Math.floor(Math.random() * 4999) + 1; // 1..4999
    const payload = JSON.stringify({ from: usernameFrom, to: usernameTo, amount });
    const res = http.post(`${base}/transfer`, payload, { headers });
    check(res, {
      'transfer status is 200': (r) => r.status === 200,
    });
    // record duration of transfer request
    if (res && res.timings && typeof res.timings.duration === 'number') {
      transferTrend.add(res.timings.duration);
    }
  });

  sleep(1);
}
