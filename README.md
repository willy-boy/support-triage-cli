# Support Triage CLI

Petit outil en ligne de commande qui simule ce que ferait un Customer Success Engineer face à une pile de tickets : vérifier l'état du service, juger la sévérité, et produire un rapport clair — avec un coup de main de l'IA, vérifié.

Ce fichier est le **cahier des charges**. Le pas-à-pas pour le construire dans Claude Code est dans `EXERCICES_CLAUDE_CODE.md`.

---

## Objectif fonctionnel

Le CLI doit :

1. Lire `data/tickets_sample.csv` (un ticket par ligne : id, client, date, service, code HTTP, message).
2. Pour chaque ticket, interroger une mini-API locale (`GET /status/:service`, voir `docs/mock-api-spec.md`) pour savoir si le service est `healthy`, `degraded` ou `down`.
3. Classer chaque ticket en sévérité **P1 à P4** à partir du code HTTP et du statut du service :
   - **P1** : service `down`, ou code 5xx avec impact client direct
   - **P2** : `degraded`, ou 429 répété (rate limit)
   - **P3** : 401/403 (problème côté client, pas produit)
   - **P4** : le reste (200 avec simple signalement, latence, etc.)
4. Pour les tickets P1/P2 uniquement, demander à l'API Claude un résumé en une phrase orientée client + une action recommandée.
5. Générer un rapport markdown (`report.md`) groupé par sévérité (P1 en premier), avec pour chaque ticket : id, client, service, sévérité, et — si P1/P2 — le résumé IA.

## Pourquoi ce découpage P1–P4 et ces codes
C'est directement ce que tu as pratiqué en Leçon 3 (AWS/CloudWatch) : 401/403 = à corriger côté client, 429 = quota, 5xx = escalade produit. Le but ici est de coder ce réflexe plutôt que de le réciter.

## Architecture cible (à affiner toi-même en mode Plan)
```
support-triage-cli/
├── data/tickets_sample.csv      (fourni)
├── docs/mock-api-spec.md        (fourni)
├── src/...                      (à créer avec Claude Code)
├── mock-api/...                 (à créer avec Claude Code)
├── report.md                    (généré à l'exécution)
├── package.json                 (à créer)
└── CLAUDE.md                    (à créer via /init)
```

## Critères de réussite
- `node src/index.js` (ou équivalent) produit un `report.md` lisible, trié par sévérité.
- La mini-API tourne en local et a été testée à la main dans Postman avant d'être appelée par le CLI.
- Le résumé IA des tickets P1/P2 est comparé à la classification par règles — tu sais dire, pour chaque cas, si l'IA a raison ou se trompe.
- Le repo est sur GitHub (comme `exercice-JS` et `nba-tracker`), avec un historique de commits qui raconte la construction par étapes.

## Prérequis
- Node.js installé (déjà utilisé en Leçon JS).
- Claude Code installé (voir étape 0 de `EXERCICES_CLAUDE_CODE.md`).
- Une clé API Anthropic pour l'étape IA (console.anthropic.com) — optionnel si tu veux sauter cette étape.
- Postman installé (gratuit) pour l'étape 4.
