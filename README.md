
# TB TaxoSearchBox Application

L'application est composée de 3 projets :

- **tb-tsb-lib-app** : l'application elle-même, qui sert à faire tourner la librairie
- **tb-tsb-lib** : la librairie
- **tb-tsb-lib-app-e2e** : les tests e2e (généré automatiquement par Angular)

Voir le fichier **angular.json** à la racine du projet.

## Installation

- `yarn add http://psing.e-veg.net/tb-tsb-lib-0.0.1.tgz`
- ou `npm install http://psing.e-veg.net/tb-tsb-lib-0.0.1.tgz`
- Voir les dépendances (peer dependencies) de la librairie (angular/common, /core, /material, /cdk et rxjs)
- Importer un thème angular material dans le fichier css de l'application principale
- Ajouter les icones Material dans l'index.html de l'application principale :
`<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">`

Importer `TbTsbLibModule` dans `app.module.ts` :`import { TbTsbLibModule } from 'tb-tsb-lib'`



## Fonctionnement

La librairie propose un composant et un service.
- le composant `<tb-tsb-search-box></tb-tsb-search-box>`
- le service `repositoryService`

### Standarisation des données
Les données en provenance d'un référentiel sont standardisées avant d'être utilisées dans le module (et donc avant d'être renvoyées par le module). Ainsi, le module peut traiter de la même façon n'importe quel référentiel.
Ex :
```flow
st=>start: baseflor item
op=>operation: repositoryService.standradize()
e=>end: RepositoryItem object
st->op->e
```

> baseflor item: `{ bdnff_nomen_id: 50284, bdnff_taxin_nomen: 7075, scientific_name: 'Poa annua L.', biological_type: 'test(hbis)', ... }`
>
> RepositoryItem: `{ id: 50284, idNomen: 50284, idTaxo: 7075, name: 'Poa annua', author: 'L.', rawData?: Object }`
>
> `rawData` est attaché à un RepositoryItem seulement si demandé. Il contient, sous form d'objet, tous les champs du référentiels inital (non standardisés)

## Utilisation

### Composant `<tb-tsb-search-box>`

Par défaut, aucun paramètre n'est obligatoire.

| Paramètre | Requis | Type | Valeurs | Valeur par défaut | Description
|--|--|--|--|--|--|--|
| level |  | string | "idiotaxon", "synusy", "microcenosis", etc. | "idiotaxon" | le niveau d'intégration. Pour le Cel, ce sera toujours 'idiotaxon' |
| defaultRepository |  | string | un nom de référentiel | Le premier accessible | référentiel à utiliser par défaut |
| fixedRepository |  | string | un nom de référentiel | - | forcer l'utilisation d'un référentiel |
| allowUnvalidatedData |  | boolean |  | true | autoriser la saisie d'une donnée hors référentiel |
| autoComplete |  | boolean |  | true | si `false`, pas d'autocomplétion, le module renvoie tous les résultats |
| autoResetWhenSelected |  | boolean |  |  | remet l'input de saisie à zéro après la saisie |
| showRepositoryInput |  | boolean |  | true | affiche le sélecteur de référentiels |
| inputFullWidth |  | boolean |  | true | `width="100%"` |
| floatLabel |  | string | "auto", "always", "never" | "auto" | c'est un paramètre de l'input Material |
| hintRepoLabel |  | boolean |  | true | c'est un paramètre de l'input Material |
| placeholder |  | string | chaîne de caractères | - | pour modifier le placeholder par défaut |
| showAuthor |  | boolean |  | true | affiche les autorités dans l'autocomplete |
| showRepositoryDescription |  | boolean |  | false | affiche la description du référentiel |
| attachRawData |  | boolean |  | false | ajoute l'objet rawData à la réponse |

### RepositoryService
Pour l'instant, deux fonctions utiles :
- `listAllRepositories`
- `getRepoAccordingToLevel(level)`

## Serveur de développement

Ne pas oublier de reconstruire la librairie avant de servir l'application (`npm run build_serve` fait les deux à la suite).

## Build
-  `npm run build_lib` pour construire la librairie
-  `npm run build_serve` pour construire la librairie et servir l'application principale
-  `npm run build_pack` for construire et packager la librairie


> The --prod meta-flag compiles with AOT by default.


Le build et la package sont dans le répertoire `dist/`.

## Tests unitaires
...
