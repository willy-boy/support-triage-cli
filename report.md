# Rapport de triage — Support tickets

_Généré le 2026-06-29T09:42:50.041Z_



## P1

### T-1001 — Acme Corp
- **Service** : billing-api
- **HTTP** : 500
- **Sévérité** : P1
- **Message** : Erreur 500 lors de la generation de facture
- **Résumé IA** : Acme Corp is experiencing a P1 outage where the billing-api returns HTTP 500 errors when generating invoices.
- **Action recommandée** : Immediately escalate to the billing-api on-call engineering team to investigate the 500 errors in the invoice generation service; review recent deployments and server logs, and provide Acme Corp with an initial status update given the P1 severity.

### T-1002 — Globex
- **Service** : auth-service
- **HTTP** : 401
- **Sévérité** : P1
- **Message** : Token expire l'utilisateur ne peut plus se connecter
- **Résumé IA** : Globex users are unable to log in to the auth-service because their authentication tokens are expiring, resulting in 401 errors.
- **Action recommandée** : Escalate this P1 immediately to the auth-service team to investigate token expiration/refresh handling; verify token TTL and refresh-token configuration, check for recent auth deployments or clock-skew issues, and provide Globex an interim workaround (re-authentication) while a fix is rolled out.

### T-1005 — Acme Corp
- **Service** : billing-api
- **HTTP** : 503
- **Sévérité** : P1
- **Message** : Service indisponible plusieurs clients impactes
- **Résumé IA** : We are aware that the billing-api is currently returning 503 errors and affecting multiple users, and our team is actively working to restore service.
- **Action recommandée** : Escalate as P1 to the billing-api on-call team to investigate the 503 service outage; check service health, dependencies, and recent deployments, and provide status updates to Acme Corp.

### T-1007 — Globex
- **Service** : auth-service
- **HTTP** : 500
- **Sévérité** : P1
- **Message** : Erreur serveur lors du refresh de token
- **Résumé IA** : Globex is experiencing a critical server error (HTTP 500) on auth-service when refreshing tokens, preventing authentication.
- **Action recommandée** : Escalate this P1 immediately to the auth-service on-call engineer to investigate the token refresh endpoint server error, check recent deployments and error logs, and provide Globex with a status update and ETA.

### T-1010 — Umbrella
- **Service** : notifications-api
- **HTTP** : 500
- **Sévérité** : P1
- **Message** : Webhook non delivre erreur 500 cote notre API
- **Résumé IA** : We are investigating a server-side error (HTTP 500) preventing webhook notifications from being delivered through the notifications-api.
- **Action recommandée** : Escalate as P1 to the notifications-api on-call engineer; review server logs and error tracking for 500 errors on the webhook delivery endpoint, identify the root cause, and confirm restoration of webhook delivery for Umbrella.

## P2

### T-1003 — Initech
- **Service** : billing-api
- **HTTP** : 429
- **Sévérité** : P2
- **Message** : Trop de requetes rate limit atteint pendant un import en masse
- **Résumé IA** : Initech is encountering HTTP 429 rate limit errors on the billing-api during a bulk import operation.
- **Action recommandée** : Review the customer's current rate limit tier and request volume; advise on batching or throttling the bulk import, and evaluate a temporary rate limit increase if appropriate.

### T-1008 — Initech
- **Service** : search-api
- **HTTP** : 429
- **Sévérité** : P2
- **Message** : Rate limit pendant un pic de trafic previsible
- **Résumé IA** : Initech is experiencing HTTP 429 rate-limit errors on the search-api during an anticipated traffic spike.
- **Action recommandée** : Review Initech's current rate-limit configuration and temporarily raise their search-api quota to accommodate the predictable traffic peak, then follow up on a long-term limit adjustment or burst-handling plan.

### T-1009 — Massive Dynamic
- **Service** : billing-api
- **HTTP** : 401
- **Sévérité** : P2
- **Message** : Identifiants invalides apres rotation de cle
- **Résumé IA** : Massive Dynamic is receiving 401 errors on the billing-api due to invalid credentials following a key rotation.
- **Action recommandée** : Verify the customer's API keys were correctly updated after rotation; confirm the new key is active and the old key has been fully deprovisioned, then guide the customer to update their stored credentials and retry.

## P3

### T-1006 — Hooli
- **Service** : notifications-api
- **HTTP** : 403
- **Sévérité** : P3
- **Message** : Acces refuse cle API probablement mal configuree cote client

## P4

### T-1004 — Umbrella
- **Service** : search-api
- **HTTP** : 200
- **Sévérité** : P4
- **Message** : Latence elevee signalee par le client mais reponse OK