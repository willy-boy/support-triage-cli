require('dotenv').config();
const path = require('path');
const { readTickets } = require('./csvReader');
const { getStatus }   = require('./statusClient');
const { classify }    = require('./classifier');
const { enrich }      = require('./aiSummary');
const { writeReport } = require('./reportWriter');

const CSV_PATH    = path.join(__dirname, '../data/tickets_sample.csv');
const REPORT_PATH = path.join(__dirname, '../report.md');

async function main() {
  const tickets = readTickets(CSV_PATH);
  console.log(`${tickets.length} tickets chargés.`);

  // Classification
  const classified = await Promise.all(
    tickets.map(async ticket => {
      const serviceStatus = await getStatus(ticket.service);
      return { ...ticket, severity: classify(ticket, serviceStatus) };
    })
  );

  const counts = { P1: 0, P2: 0, P3: 0, P4: 0 };
  classified.forEach(t => counts[t.severity]++);
  console.log('Classification :', counts);

  // Enrichissement IA (P1/P2 uniquement, optionnel)
  const enriched = await Promise.all(
    classified.map(async ticket => {
      if (ticket.severity === 'P1' || ticket.severity === 'P2') {
        return enrich(ticket);
      }
      return ticket;
    })
  );

  writeReport(enriched, REPORT_PATH);
  console.log('Rapport généré : report.md');
}

main().catch(err => {
  console.error('Erreur :', err.message);
  process.exit(1);
});
