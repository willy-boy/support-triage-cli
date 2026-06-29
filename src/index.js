require('dotenv').config();
const path = require('path');
const { readTickets } = require('./csvReader');
const { getStatus }   = require('./statusClient');
const { classify }    = require('./classifier');
const { enrich }      = require('./aiSummary');
const { writeReport } = require('./reportWriter');

const CSV_PATH    = path.join(__dirname, '../data/tickets_sample.csv');
const REPORT_PATH = path.join(__dirname, '../report.md');

// --watch [interval_seconds]
const args = process.argv.slice(2);
const watchIdx = args.indexOf('--watch');
const isWatch = watchIdx !== -1;
const intervalSec = (() => {
  const next = args[watchIdx + 1];
  const parsed = parseInt(next, 10);
  return isWatch && !isNaN(parsed) && parsed > 0 ? parsed : 30;
})();

async function runPipeline(withAI) {
  const ts = new Date().toLocaleTimeString('fr-FR');
  console.log(`\n─── Triage ${ts} ───`);

  const tickets = readTickets(CSV_PATH);

  const classified = await Promise.all(
    tickets.map(async ticket => {
      const serviceStatus = await getStatus(ticket.service);
      return { ...ticket, severity: classify(ticket, serviceStatus) };
    })
  );

  const counts = { P1: 0, P2: 0, P3: 0, P4: 0 };
  classified.forEach(t => counts[t.severity]++);
  console.log('Classification :', counts);

  const enriched = withAI
    ? await Promise.all(
        classified.map(ticket =>
          ticket.severity === 'P1' || ticket.severity === 'P2'
            ? enrich(ticket)
            : ticket
        )
      )
    : classified;

  writeReport(enriched, REPORT_PATH);
  console.log('Rapport généré : report.md');
}

async function main() {
  if (isWatch) {
    console.log(`Mode watch — intervalle : ${intervalSec}s | Ctrl+C pour arrêter | enrichissement IA désactivé`);
    await runPipeline(false);
    setInterval(
      () => runPipeline(false).catch(err => console.error('Erreur :', err.message)),
      intervalSec * 1000
    );
  } else {
    await runPipeline(true);
  }
}

main().catch(err => {
  console.error('Erreur :', err.message);
  process.exit(1);
});
