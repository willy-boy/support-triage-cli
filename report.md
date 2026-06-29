# Rapport de triage — Support tickets

_Généré le 2026-06-29T09:15:50.535Z_



## P1

### T-1001 — Acme Corp
- **Service** : billing-api
- **HTTP** : 500
- **Sévérité** : P1
- **Message** : Erreur 500 lors de la generation de facture
- **Résumé IA** : Acme Corp is experiencing a critical (P1) failure where the billing-api returns HTTP 500 errors during invoice generation.
- **Action recommandée** : Immediately escalate to the billing-api on-call engineering team to investigate the 500 errors in the invoice generation service; review recent deployments and error logs, and provide Acme Corp with a status update and ETA.

### T-1002 — Globex
- **Service** : auth-service
- **HTTP** : 401
- **Sévérité** : P1
- **Message** : Token expire l'utilisateur ne peut plus se connecter
- **Résumé IA** : Globex users are unable to log in to the auth-service due to expired authentication tokens (HTTP 401).
- **Action recommandée** : Escalate this P1 to the authentication team to investigate token expiration/refresh logic and verify the customer's token lifetime and credential configuration; restore login access as a priority.

### T-1005 — Acme Corp
- **Service** : billing-api
- **HTTP** : 503
- **Sévérité** : P1
- **Message** : Service indisponible plusieurs clients impactes
- **Résumé IA** : The billing-api service is currently unavailable (HTTP 503), impacting multiple Acme Corp users.
- **Action recommandée** : Escalate immediately to the on-call billing-api team as a P1 incident, investigate the 503 outage, and provide affected customers with status updates until service is restored.

### T-1007 — Globex
- **Service** : auth-service
- **HTTP** : 500
- **Sévérité** : P1
- **Message** : Erreur serveur lors du refresh de token
- **Résumé IA** : Globex is experiencing server errors (HTTP 500) when refreshing authentication tokens on the auth-service, which is currently blocking access.
- **Action recommandée** : Escalate this P1 incident to the auth-service on-call engineer to investigate the token refresh failures, check server logs and recent deployments for the 500 errors, and provide Globex with an immediate status update.

### T-1010 — Umbrella
- **Service** : notifications-api
- **HTTP** : 500
- **Sévérité** : P1
- **Message** : Webhook non delivre erreur 500 cote notre API
- **Résumé IA** : Umbrella is experiencing failed webhook deliveries from the notifications-api, returning HTTP 500 errors on our side.
- **Action recommandée** : Escalate as P1 to the notifications-api on-call engineer to investigate server-side 500 errors causing webhook delivery failures, and provide Umbrella with an incident update and ETA.

## P2

### T-1003 — Initech
- **Service** : billing-api
- **HTTP** : 429
- **Sévérité** : P2
- **Message** : Trop de requetes rate limit atteint pendant un import en masse
- **Résumé IA** : You're encountering rate limit (429) errors on the billing-api during a bulk import operation.
- **Action recommandée** : Review Initech's current rate limit tier and request volume; advise the customer to throttle or batch their bulk import requests, and evaluate a temporary rate limit increase if appropriate.

### T-1008 — Initech
- **Service** : search-api
- **HTTP** : 429
- **Sévérité** : P2
- **Message** : Rate limit pendant un pic de trafic previsible
- **Résumé IA** : Initech is experiencing HTTP 429 rate-limiting errors on the search-api during an anticipated traffic spike.
- **Action recommandée** : Review Initech's current rate limit configuration and temporarily increase their search-api quota to accommodate the predictable traffic peak; advise the customer on implementing exponential backoff and request batching to stay within limits.

### T-1009 — Massive Dynamic
- **Service** : billing-api
- **HTTP** : 401
- **Sévérité** : P2
- **Message** : Identifiants invalides apres rotation de cle
- **Résumé IA** : Your billing-api requests are returning 401 errors because the API credentials are being rejected following a recent key rotation.
- **Action recommandée** : Verify the customer's new API key was correctly provisioned and propagated after rotation; confirm the client is sending the updated key and revoke/reissue credentials if a mismatch is found.

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