function classify(ticket, serviceStatus) {
  const status = serviceStatus.status;
  const http = ticket.http_status;

  if (status === 'down')      return 'P1';
  if (http >= 500)            return 'P1';
  if (status === 'degraded')  return 'P2';
  if (http === 429)           return 'P2';
  if (http === 401 || http === 403) return 'P3';
  return 'P4';
}

module.exports = { classify };
