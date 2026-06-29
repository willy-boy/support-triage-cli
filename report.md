# Rapport de triage — Support tickets

_Généré le 2026-06-29T09:29:21.742Z_



## P1

### T-1001 — Acme Corp
- **Service** : billing-api
- **HTTP** : 500
- **Sévérité** : P1
- **Message** : Erreur 500 lors de la generation de facture
- **Résumé IA** : Acme Corp is experiencing HTTP 500 errors when generating invoices via the billing-api, blocking invoice creation.
- **Action recommandée** : Escalate this P1 incident to the billing-api on-call engineer immediately; investigate server-side 500 errors in the invoice generation service, review recent deployments and error logs for T-1001, and provide Acme Corp with a status update and ETA.

### T-1002 — Globex
- **Service** : auth-service
- **HTTP** : 401
- **Sévérité** : P1
- **Message** : Token expire l'utilisateur ne peut plus se connecter
- **Résumé IA** : Globex users are unable to log in to the auth-service because their authentication tokens are expiring, resulting in 401 errors.
- **Action recommandée** : Escalate this P1 issue to the auth-service team to investigate token expiration/refresh logic; verify token TTL and refresh-token configuration, check for recent auth deployments, and confirm whether the issue is account-wide or isolated.

### T-1005 — Acme Corp
- **Service** : billing-api
- **HTTP** : 503
- **Sévérité** : P1
- **Message** : Service indisponible plusieurs clients impactes
- **Résumé IA** : The billing-api is currently returning 503 errors and is unavailable, affecting multiple Acme Corp users.
- **Action recommandée** : Escalate immediately as a P1 incident to the billing-api on-call team, verify service health and recent deployments, and provide the customer with a status update and ETA.

### T-1007 — Globex
- **Service** : auth-service
- **HTTP** : 500
- **Sévérité** : P1
- **Message** : Erreur serveur lors du refresh de token
- **Résumé IA** : We are investigating a server error (HTTP 500) affecting token refresh on the authentication service, and we are treating this as a top-priority issue.
- **Action recommandée** : Escalate this P1 to the auth-service on-call engineer to investigate the 500 errors in the token refresh flow; check recent deployments, token service logs, and dependent services, then provide Globex with a status update and ETA.

### T-1010 — Umbrella
- **Service** : notifications-api
- **HTTP** : 500
- **Sévérité** : P1
- **Message** : Webhook non delivre erreur 500 cote notre API
- **Résumé IA** : We are investigating a P1 issue where webhooks for your notifications-api are failing with HTTP 500 errors on our side.
- **Action recommandée** : Escalate to the notifications-api on-call engineer to investigate server-side 500 errors in the webhook delivery pipeline and check recent deployments and error logs.

## P2

### T-1003 — Initech
- **Service** : billing-api
- **HTTP** : 429
- **Sévérité** : P2
- **Message** : Trop de requetes rate limit atteint pendant un import en masse
- **Résumé IA** : Initech is hitting rate limits (HTTP 429) on the billing-api during a bulk import operation.
- **Action recommandée** : Review the customer's rate limit tier and current usage, advise implementing request throttling, retries with exponential backoff, or batching for bulk imports, and evaluate whether a temporary or permanent rate limit increase is warranted.

### T-1008 — Initech
- **Service** : search-api
- **HTTP** : 429
- **Sévérité** : P2
- **Message** : Rate limit pendant un pic de trafic previsible
- **Résumé IA** : Initech is hitting rate limits (HTTP 429) on the search-api during an anticipated traffic spike.
- **Action recommandée** : Review the customer's current rate limit tier and temporarily raise their search-api quota to accommodate the predictable traffic peak; advise on rate limit best practices or a plan upgrade for sustained higher throughput.

### T-1009 — Massive Dynamic
- **Service** : billing-api
- **HTTP** : 401
- **Sévérité** : P2
- **Message** : Identifiants invalides apres rotation de cle
- **Résumé IA** : Massive Dynamic is experiencing 401 authentication errors on the billing-api following a key rotation, indicating their credentials are no longer valid.
- **Action recommandée** : Verify the customer's new API key/credentials are correctly configured post-rotation, confirm the old key was properly deprecated, and guide them through updating their billing-api authentication settings.

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