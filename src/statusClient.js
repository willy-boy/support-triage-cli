const http = require('http');

const BASE_URL = 'http://localhost:3000';
const TIMEOUT_MS = 5000;
const cache = new Map();
const FALLBACK = { status: 'unknown' };

function getStatus(service) {
  if (cache.has(service)) {
    return Promise.resolve(cache.get(service));
  }

  return new Promise((resolve) => {
    const req = http.get(`${BASE_URL}/status/${service}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode === 404) {
            cache.set(service, FALLBACK);
            return resolve(FALLBACK);
          }
          const parsed = JSON.parse(data);
          cache.set(service, parsed);
          resolve(parsed);
        } catch (err) {
          console.warn(`[statusClient] Réponse invalide pour "${service}" : ${err.message}`);
          resolve(FALLBACK);
        }
      });
    });

    req.setTimeout(TIMEOUT_MS, () => {
      req.destroy(new Error(`Timeout après ${TIMEOUT_MS}ms`));
    });

    req.on('error', (err) => {
      console.warn(`[statusClient] "${service}" injoignable — ${err.message}`);
      resolve(FALLBACK);
    });
  });
}

module.exports = { getStatus };
