const fs = require('fs');
const path = require('path');

function readTickets(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const lines = raw.trim().split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      ticket_id:   values[0].trim(),
      customer:    values[1].trim(),
      timestamp:   values[2].trim(),
      service:     values[3].trim(),
      http_status: parseInt(values[4].trim(), 10),
      message:     values[5].trim(),
    };
  });
}

module.exports = { readTickets };
