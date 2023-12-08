# Projet de Chat utilisant NextJS, NestJS et OpenAI API 

## Fonctionnalités du Projet

### 1. Communication En Temps Réel

Les utilisateurs pourront échanger des messages en direct. Le module de chat en temps réel est construit avec NextJS en vue côté client et NestJS côté serveur, avec socket.io assurant la communication temps réel.
=> Déjà fait grace à l'exemple vu en cours

### 2. Traduction Automatique

En utilisant l'API OpenAI, les messages des utilisateurs peuvent être traduits en temps réel dans la langue de leur choix. Cette fonctionnalité permet de rendre le chat vraiment global et de briser les barrières linguistiques entre les utilisateurs.
Remarques:
- Appel AJAX à une IA, avec un prompt qui dit de traduire dans une certaine langue, tout ce qui se trouve après :
- Cet appel AJAX se fait uniquement si "Traduction" n'est pas à "None" !
- Fichiers: LanguageForm.js, page.tsx

### 3. Validation De L'Information

Pour promouvoir l'exactitude et la fiabilité de l'information dans les discussions, le chatbot va utiliser OpenAI pour vérifier les informations en temps réel. Si un utilisateur partage une information, le chatbot peut la vérifier et le signaler si l'information semble inexacte ou trompeuse.
Remarques:
- Appel AJAX à une IA, le prompt demande de repondre vrai ou faux au dernier message envoyé
- Cet appel AJAX se fait uniquement si "vérifier les informations" est coché !
- Si le dernier message envoyé est vrai alors on prepend "✅" sinon "❌"

### 4. Suggestions De Réponse

Basées sur le contexte de la conversation en cours, OpenAI propose des réponses aux utilisateurs pour faciliter et accélérer leur interaction dans le chat. Les utilisateurs pourront voir une liste de réponses suggérées et sélectionner celle qui convient le mieux à leurs intentions.
Remarques:
- Appel AJAX à une IA qui se base sur la conversation en cours pour proposer des messages

### 5. Speech to text

Utiliser le model whisper pour permettre à l'utilisateur de transmettre un audio afin qu'il soit transcripté en texte.
Remarques:
- Je n'ai pas de clé openAPI mais j'ai fait comme si j'en avais une