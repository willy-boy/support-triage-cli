# Spec — Mini-API de statut (mock)

À donner à Claude Code en étape 4. C'est le seul contrat à respecter ; l'implémentation (Express ou Node natif, port, structure des fichiers) est libre.

## Endpoint

```
GET /status/:service
```

### Services connus (à coder en mémoire, pas besoin de base de données)
| service          | status     |
|-------------------|------------|
| billing-api       | degraded   |
| auth-service      | down       |
| search-api        | healthy    |
| notifications-api | healthy    |

### Réponse — 200 OK
```json
{
  "service": "billing-api",
  "status": "degraded",
  "lastIncident": "2026-06-24T07:00:00Z"
}
```
`status` ∈ `healthy`, `degraded`, `down`. `lastIncident` est `null` si aucun incident récent.

### Réponse — 404 Not Found
Si `:service` n'existe pas dans la liste connue :
```json
{ "error": "unknown service" }
```

## Utilisation attendue par le CLI
Pour chaque ticket de `data/tickets_sample.csv`, le CLI appelle `GET /status/<service du ticket>` et utilise le `status` retourné comme un facteur supplémentaire dans la classification (ex : `down` pousse vers P1 même si le code HTTP du ticket seul aurait suggéré moins grave).

## Test manuel à faire dans Postman avant automatisation (étape 4)
1. Lancer le serveur mock en local.
2. Créer une requête GET vers `http://localhost:<port>/status/billing-api` → vérifier `degraded`.
3. Tester aussi `http://localhost:<port>/status/inconnu-api` → vérifier la 404.
4. Seulement après ces vérifications manuelles, laisser le CLI appeler l'endpoint automatiquement.
