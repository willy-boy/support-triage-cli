const Anthropic = require('@anthropic-ai/sdk');

let client = null;

function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!client) client = new Anthropic();
  return client;
}

async function enrich(ticket) {
  const ai = getClient();
  if (!ai) {
    console.warn('ANTHROPIC_API_KEY absent — enrichissement IA ignoré.');
    return ticket;
  }

  const prompt = `You are a Customer Success Engineer triaging a support ticket.
Respond ONLY with valid JSON (no markdown, no explanation) in this exact shape:
{"summary":"<one client-facing sentence>","action":"<recommended action for the support team>"}

Ticket:
- ID: ${ticket.ticket_id}
- Customer: ${ticket.customer}
- Service: ${ticket.service}
- HTTP status: ${ticket.http_status}
- Severity: ${ticket.severity}
- Message: ${ticket.message}`;

  try {
    const response = await ai.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 256,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].text.trim();
    const parsed = JSON.parse(text);

    return { ...ticket, aiSummary: parsed.summary, aiAction: parsed.action };
  } catch (err) {
    console.warn(`[aiSummary] ${ticket.ticket_id} — ${err.message}`);
    return ticket;
  }
}

module.exports = { enrich };
