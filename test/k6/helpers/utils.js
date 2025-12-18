import http from 'k6/http';
import { check } from 'k6';
import { getBaseUrl } from './getBaseUrl.js';
import faker from 'k6/x/faker';

// Generate a random username for user registration
export function randomName() {
  const id = Math.random().toString(36).substring(2, 10);
  return faker.person.firstName() + id;
}

// Register a user. Checks that status is 201 (created).
export function registerUser(username, password, favorecido = false) {
  const url = `${getBaseUrl()}/users/register`;
  const payload = JSON.stringify({ username, password, favorecido });
  const params = { headers: { 'Content-Type': 'application/json' } };
  const res = http.post(url, payload, params);
  check(res, {
    'register status is 201': (r) => r.status === 201,
  });
  return res;
}

// Login a user. Checks that status is 200 (ok).
export function loginUser(username, password) {
  const url = `${getBaseUrl()}/users/login`;
  const payload = JSON.stringify({ username, password });
  const params = { headers: { 'Content-Type': 'application/json' } };
  const res = http.post(url, payload, params);
  check(res, {
    'login status is 200': (r) => r.status === 200,
  });
  return res;
}
