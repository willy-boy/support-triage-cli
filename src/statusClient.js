const http = require('http');

const BASE_URL = 'http://localhost:3000';
const cache = new Map();

function getStatus(service) {
  if (cache.has(service)) {
    return Promise.resolve(cache.get(service));
  }

  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}/status/${service}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const parsed = JSON.parse(data);
        if (res.statusCode === 404) {
          const result = { status: 'unknown' };
          cache.set(service, result);
          resolve(result);
        } else {
          cache.set(service, parsed);
          resolve(parsed);
        }
      });
    }).on('error', reject);
  });
}

module.exports = { getStatus };
