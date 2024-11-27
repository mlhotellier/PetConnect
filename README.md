# My Pet Diary

Bienvenue dans le projet frontend de notre application ! Ce projet est construit avec React et permet d'avoir toutes les informations nécessaires au bien-être de vos animaux (suivi, contact, documents, etc.) d'interagir avec un backend via des API.

## Table des matières
- [Installation](#installation)
- [Configuration](#configuration)
- [Démarrage du projet](#démarrage-du-projet)
- [Structure des fichiers](#structure-des-fichiers)
- [Technologies utilisées](#technologies-utilisées)
- [Contributions](#contributions)
- [License](#license)
- [Contact](#contact)

---

## Installation

1. Clonez le projet depuis le dépôt Git :
   ```bash
   git clone https://github.com/mlhotellier/my-pet-diary.git
   ```
2. Accédez au dossier du projet :
    ```bash
    cd my-pet-diary
    ```
3. Installez les dépendances du projet :
    ```bash
    npm install
    ```
    ou 

    ```bash
    yarn install
    ```


## Configuration
Avant de démarrer l'application, vous devez configurer certaines variables d'environnement. Créez un fichier .env à la racine de votre projet et ajoutez les variables nécessaires.

Exemple de fichier .env :

```bash
# L'URL du serveur backend
REACT_APP_SERVER_BACKEND_URL=http://localhost:5000
```

Note : Le fichier .env doit être ajouté dans votre .gitignore pour éviter de compromettre vos informations sensibles.

## Démarrage du projet
Pour démarrer le projet en mode développement, utilisez la commande suivante :

```bash
npm start
```
ou 

```bash
yarn start
```

Cela démarrera l'application sur http://localhost:3000. Vous pourrez voir le frontend dans votre navigateur.

## Structure des fichiers
Voici la structure des fichiers du projet :

```bash
/frontend
  ├── /public                 # Fichiers publics comme index.html
  ├── /src                    # Dossier principal du code source
      ├── /components          # Composants réutilisables
      ├── /pages               # Pages principales de l'application
      ├── /services            # Appels à l'API backend
      ├── /styles              # Fichiers CSS
      ├── App.js               # Composant principal
      ├── index.js             # Point d'entrée
  ├── .env                     # Variables d'environnement
  ├── .gitignore               # Fichiers à ignorer par Git
  ├── README.md                # Ce fichier
  └── package.json             # Dépendances et scripts
```

## Technologies utilisées
Ce projet est construit avec les technologies suivantes :

React : Bibliothèque JavaScript pour construire des interfaces utilisateur.
Axios : Pour effectuer des requêtes HTTP vers l'API backend.
React Router : Pour la gestion de la navigation et des routes.
CSS : Pour la mise en forme du projet.

## Contributions
Les contributions à ce projet sont les bienvenues ! Si vous souhaitez contribuer, veuillez soumettre une pull request avec vos modifications proposées. Assurez-vous de suivre les bonnes pratiques de développement et de tester vos modifications avant de les soumettre.

## Licence
Ce projet est sous licence MIT.

## Contact
Pour toute question ou demande de renseignements, n'hésitez pas à me contacter par e-mail à l'adresse mathislhotellier@gmail.com.