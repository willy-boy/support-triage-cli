const http = require('http');

const PORT = 3000;

const SERVICES = {
  'billing-api':       { status: 'degraded', lastIncident: '2026-06-24T07:00:00Z' },
  'auth-service':      { status: 'down',     lastIncident: '2026-06-24T06:00:00Z' },
  'search-api':        { status: 'healthy',  lastIncident: null },
  'notifications-api': { status: 'healthy',  lastIncident: null },
};

const server = http.createServer((req, res) => {
  const match = req.url.match(/^\/status\/([^/?]+)$/);

  if (!match) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'not found' }));
    return;
  }

  const serviceName = match[1];
  const service = SERVICES[serviceName];

  if (!service) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'unknown service' }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ service: serviceName, ...service }));
});

server.listen(PORT, () => {
  console.log(`Mock API running on http://localhost:${PORT}`);
  console.log('Services disponibles : billing-api, auth-service, search-api, notifications-api');
});
