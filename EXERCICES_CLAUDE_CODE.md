# Exercices — apprendre Claude Code en construisant le Support Triage CLI

Chaque étape associe une **tâche concrète** sur le projet à un **concept Claude Code** à observer. Fais les étapes dans l'ordre, dans un terminal, depuis le dossier `support-triage-cli/`. Ne copie pas de code toi-même : décris ce que tu veux à Claude Code, regarde ce qu'il propose, corrige au besoin.

---

## Étape 0 — Installation (5 min)

Windows, dans PowerShell :
```powershell
irm https://claude.ai/install.ps1 | iex
```
Puis vérifie et connecte-toi :
```powershell
claude --version
cd "support-triage-cli"
claude
```
Tu seras invité à te connecter avec ton compte Claude au premier lancement.

**Concept :** Claude Code tourne dans ton terminal, directement sur tes fichiers locaux — pas dans un navigateur. Il peut lire, écrire, exécuter des commandes (npm, git, node...) dans ce dossier.

---

## Étape 1 — Démarrer le projet et le fichier CLAUDE.md

Une fois dans la session Claude Code (toujours dans `support-triage-cli/`), tape :
```
/init
```
Observe ce qui est généré. Puis demande-lui d'enrichir le résultat :
> "Lis README.md et docs/mock-api-spec.md, puis mets à jour CLAUDE.md pour résumer l'objectif du projet et les règles de classification P1-P4."

**Concept :** `CLAUDE.md` est la mémoire du projet — Claude Code le relit au début de **chaque** session future. C'est l'équivalent d'un brief qu'on ne réécrit qu'une fois.

---

## Étape 2 — Mode Plan avant de coder

Active le mode Plan (lecture seule, rien n'est modifié) en appuyant deux fois sur **Shift+Tab**.

Prompt suggéré :
> "Lis README.md, docs/mock-api-spec.md et data/tickets_sample.csv. Propose une architecture pour un CLI Node qui lit ce CSV, interroge la mini-API de statut, classe chaque ticket en P1-P4, et génère report.md. Ne code rien encore, je veux d'abord valider le plan."

Lis le plan proposé. Demande des ajustements si besoin ("pas de framework, Node natif uniquement" par exemple). Quand tu es d'accord, sors du mode Plan et donne le feu vert pour implémenter.

**Concept :** Claude Code explore le contexte et propose un plan **avant** de toucher aux fichiers — tu valides en amont, comme un PO qui valide un plan de sprint avant que l'équipe ne code.

---

## Étape 3 — Implémentation : classification (gap observabilité/logs)

Une fois le plan validé, laisse Claude Code implémenter par petites itérations plutôt qu'en un seul mega-prompt. Exemple de séquence :
1. "Implémente d'abord juste la lecture du CSV et l'affichage des tickets en console."
2. "Ajoute maintenant la fonction de classification P1-P4 à partir du code HTTP, sans appeler encore la mini-API."
3. "Lance-le et montre-moi le résultat."

**Concept à observer :** un prompt court → un résultat testable. C'est plus facile à corriger qu'un seul prompt qui demande tout le projet d'un coup, et ça te laisse vérifier que la logique 401/403/429/5xx correspond bien à ce que tu as appris en Leçon 3.

---

## Étape 4 — Mini-API + Postman (gap Postman/API avancé)

Prompt :
> "Ajoute un petit serveur local qui implémente le contrat décrit dans docs/mock-api-spec.md (GET /status/:service). Utilise Node natif (http) ou Express, au choix. Le CLI doit l'appeler pour enrichir chaque ticket avant classification."

Avant de relancer le CLI : lance le serveur (`node mock-api/server.js` ou équivalent), ouvre **Postman**, crée une requête `GET http://localhost:3000/status/billing-api`, vérifie la réponse à la main pour 2-3 services différents.

**Concept :** tu testes manuellement dans Postman ce que ton code va ensuite consommer automatiquement. C'est exactement le réflexe attendu d'un CSE qui doit valider une intégration côté client avant de dire "c'est bon, ça doit marcher".

---

## Étape 5 — Couche IA + esprit critique (gap littératie IA)

Prompt :
> "Ajoute un appel à l'API Claude (package @anthropic-ai/sdk, clé lue depuis une variable d'environnement ANTHROPIC_API_KEY via dotenv) qui résume en une phrase orientée client chaque ticket P1 ou P2, et propose une action recommandée. Intègre ce résumé dans report.md."

Exécute, puis **compare toi-même** : pour chaque ticket P1/P2, le résumé de l'IA correspond-il à la sévérité décidée par tes règles ? Repère un cas où l'IA est vague, trop optimiste, ou se trompe.

**Concept clé pour un CSE en 2026 :** une sortie IA présentée à un client a besoin d'un filet de sécurité — ici, ta classification codée en dur. Tu dois être capable de dire *pourquoi* tu fais confiance ou pas à ce que l'IA a produit, pas juste l'afficher tel quel.

---

## Étape 6 — Git, avec Claude Code

Prompt :
> "Initialise un repo git si ce n'est pas déjà fait, crée un .gitignore adapté (node_modules, .env), et fais un commit avec un message clair décrivant l'état actuel du projet."

Relis toujours le message de commit proposé avant de valider — c'est toi qui restes responsable de l'historique. Pousse ensuite vers un nouveau repo GitHub, dans la continuité de `exercice-JS` et `nba-tracker`.

**Concept :** Claude Code peut piloter git directement (add, commit, branche, PR), mais la validation finale reste humaine.

---

## Étape 7 (bonus) — Tests et revue

Deux prompts à essayer séparément :
> "Écris des tests pour la fonction de classification de sévérité (cas 200, 401, 403, 429, 500, service down/degraded) et lance-les."

> "Relis le code comme si tu étais un reviewer externe, en te concentrant sur la gestion d'erreurs des appels à la mini-API et à l'API Claude (timeout, service injoignable, clé API manquante)."

**Concept :** Claude Code n'est pas qu'un générateur de code — c'est aussi un outil de test et de revue, utile pour repérer les trous de gestion d'erreurs avant qu'un client ne les trouve à ta place.

---

## Pour aller plus loin (optionnel)
- Demande à Claude Code de générer une vraie collection Postman (fichier `.json` exportable) à partir de `docs/mock-api-spec.md`.
- Demande-lui d'ajouter un mode `--watch` qui ré-exécute le triage toutes les X secondes (te rapproche d'un usage monitoring/observabilité).
- Une fois le projet stable, redemande un `/init` et compare le CLAUDE.md généré à celui que tu as écrit à la main en étape 1 — tu verras ce que Claude Code a appris du code entre-temps.
