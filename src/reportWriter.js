const fs = require('fs');

const PRIORITY_ORDER = ['P1', 'P2', 'P3', 'P4'];

function formatTicket(ticket) {
  const lines = [
    `### ${ticket.ticket_id} — ${ticket.customer}`,
    `- **Service** : ${ticket.service}`,
    `- **HTTP** : ${ticket.http_status}`,
    `- **Sévérité** : ${ticket.severity}`,
    `- **Message** : ${ticket.message}`,
  ];

  if (ticket.aiSummary) {
    lines.push(`- **Résumé IA** : ${ticket.aiSummary}`);
    lines.push(`- **Action recommandée** : ${ticket.aiAction}`);
  }

  return lines.join('\n');
}

function writeReport(tickets, outputPath) {
  const grouped = {};
  PRIORITY_ORDER.forEach(p => { grouped[p] = []; });
  tickets.forEach(t => grouped[t.severity].push(t));

  const sections = PRIORITY_ORDER
    .filter(p => grouped[p].length > 0)
    .map(p => {
      const header = `## ${p}`;
      const body = grouped[p].map(formatTicket).join('\n\n');
      return `${header}\n\n${body}`;
    });

  const report = [
    '# Rapport de triage — Support tickets',
    `_Généré le ${new Date().toISOString()}_`,
    '',
    ...sections,
  ].join('\n\n');

  fs.writeFileSync(outputPath, report, 'utf-8');
}

module.exports = { writeReport };
