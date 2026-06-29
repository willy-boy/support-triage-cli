const Anthropic = require('@anthropic-ai/sdk');

let client = null;
let warnedMissingKey = false;

function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    if (!warnedMissingKey) {
      console.warn('ANTHROPIC_API_KEY absent — enrichissement IA ignoré.');
      warnedMissingKey = true;
    }
    return null;
  }
  if (!client) client = new Anthropic();
  return client;
}

function extractJson(text) {
  try { return JSON.parse(text); } catch (_) {}
  const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (match) return JSON.parse(match[1]);
  throw new SyntaxError('Aucun JSON valide trouvé dans la réponse');
}

async function enrich(ticket) {
  const ai = getClient();
  if (!ai) return ticket;

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

    const block = response.content[0];
    if (!block || block.type !== 'text') {
      console.warn(`[aiSummary] ${ticket.ticket_id} — réponse inattendue (pas de bloc texte)`);
      return ticket;
    }

    const parsed = extractJson(block.text.trim());
    console.log(`[aiSummary] ${ticket.ticket_id} (${ticket.severity}) — enrichi`);
    return { ...ticket, aiSummary: parsed.summary, aiAction: parsed.action };
  } catch (err) {
    console.warn(`[aiSummary] ${ticket.ticket_id} — ${err.message}`);
    return ticket;
  }
}

module.exports = { enrich };
