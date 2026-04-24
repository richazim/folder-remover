# TODOs

- []: Supprimer les anciens dossiers indésirables non supprimés à chaque activation de l'extension dans un projet.
- []: Persister les chemins des dossiers indésirables du projet à 3 secondes de l'activation de l'extension dans un projet.
- []: A chaque fois qu'un dossier est créé et que le dossier est un dossier indésirable alors le persister en meme temps.
- []: Permettre de scanner tout le projet pour récupérer les dossiers indésirables pour les persister, lorsqu'on exécute la commande "scan".
- []: Commande "remove now" permettant de supprimer en même temps les dossiers indésirables persistés.
- []: Supprimer les dossiers indésirables quand on quitte vscode.
- []: A chaque fois qu'un dossier indésirable est supprimé, supprimer le chemin de la persistance.
- []: Supprimer les dossiers indésirables non supprimés quand vscode est lancé de nouveau et que l'extension devient active.
- []: Permettre de Définir la liste des dossiers à considérer comme indésirable (dans le paramètre vscode de l'extension).
- []: Ne pas supprimer des dossiers indésirables si le projet réouvert dans vscode est le projet qui contient ces dossiers indésirables. (Avant, l'ouverture d'un projet vscode entraine la suppression de tous les dossiers indésirables non supprimés y compris les dossiers indésirables du projet tant que ce projet fait parti des projets qui étaient ouvertes)
- [x]: Problème: Quand un projet vscode est déjà ouvert, si en plus on ouvre un second projet, l'extension s'active et entraine la suppression des dossiers indésirables du premier projet ouvert. [Or on ne veut pas qu'il supprime les dossiers indésirables du premier projet parce qu'il est toujours ouvert dans une fénêtre vscode.]
  Algorithme de résolution:
  - On doit savoir si un projet vscode est toujours ouvert ou non.
  - Et laisser l'extension supprimer seulement les dossiers indésirables des projets vscode fermés.
- []: L'extension doit s'assurer d'installer toutes les dépendances de tout projet récemment ouvert dans vscode.
- []: L'utilisateur doit pouvoir activer ou désactiver l'auto installation des dépendances (grace à une commande).
