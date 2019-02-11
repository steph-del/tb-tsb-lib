
# TB TaxoSearchBox

Le projet est composée de 3 applications :

- **tb-tsb-lib** : la librairie
- **tb-tsb-lib-app** : l'application qui fait tourner la librairie (test)
- **tb-tsb-lib-app-e2e** : les tests e2e (généré automatiquement par Angular)



Voir le fichier [**angular.json**](https://github.com/steph-del/tb-tsb-lib/blob/master/angular.json) à la racine du projet.

## Installation de la librairie

- `yarn add https://github.com/steph-del/tb-tsb-lib/releases/download/v0.1.0/tb-tsb-lib-0.1.0.tgz` (voir la dernière version)
- ou `npm install https://github.com/steph-del/tb-tsb-lib/releases/download/v0.1.0/tb-tsb-lib-0.1.0.tgz`
- Dasn l'appli principale, vérifier les versions des dépendances (peer dependencies) de la librairie (angular/common, /core, /material, /cdk et rxjs)
- Importer un thème angular material dans le fichier css de l'application principale
- Ajouter les icones Material dans l'index.html de l'application principale :
`<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">`

Importer `TbTsbLibModule` dans `app.module.ts` :`import { TbTsbLibModule } from 'tb-tsb-lib'`

## Utilisation du composant `<tb-tsb-search-box>`

Exemple d'utilisation :
[**Application test**](https://github.com/steph-del/tb-tsb-lib/tree/master/src/app/test-app)


### Paramètres en entrée @Input

Par défaut, aucun paramètre n'est obligatoire. Si vous vous contentez d'insérer la balise `<tb-tsb-search-box></tb-tsb-search-box>`, ça fonctionne avec, par défault le niveau "idiotaxon" (=espèce) et le premier référentiel disponible.


| Paramètre                 | Requis | Type     | Valeurs | Valeur par défaut | Description |
| ---                       | ---    | ---      | ---     | ---               | ---         |
| level                     |        | string   | "idiotaxon", "synusy", "microcenosis", etc. | "idiotaxon" | le niveau d'intégration. Pour le Cel, ce sera toujours 'idiotaxon' |
| defaultRepository         |        | string   | un nom de référentiel | Le premier accessible | référentiel à utiliser par défaut |
| fixedRepository           |        | string   | un nom de référentiel | - | forcer l'utilisation d'un référentiel |
| allowEmptyRepository      |        | boolean  |         | true | autorise la saisie d'une donnée hors référentiel (ajoute un référentiel 'Autre/inconnu' à la liste des ref.) |
| allowFreeValueIfNoResults |        | boolean  |         | true | autorise la saisie d'une valeur libre s'il n'y a aucun résultat avec l'auto-completion |
| autoComplete              |        | boolean  |         | true | si `false`, pas d'autocomplétion, le module renvoie tous les résultats |
| autoResetWhenSelected     |        | boolean  |         | true | remet l'input de saisie à zéro après la saisie |
| showRepositoryInput       |        | boolean  |         | true | affiche le sélecteur de référentiels |
| inputFullWidth            |        | boolean  |         | true | `width="100%"` |
| floatLabel                |        | string   | "auto", "always", "never" | "auto" | c'est un paramètre de l'input Material |
| hintRepoLabel             |        | boolean  |         | true | c'est un paramètre de l'input Material |
| placeholder               |        | string   |         | - | pour modifier le placeholder par défaut |
| editingPlaceholder        |        | string   |         | 'Modifier une donnée' | placeholder lors de l'édition d'une donnée |
| showAuthor                |        | boolean  |         | true | affiche les autorités dans l'autocomplete |
| showRepositoryDescription |    | boolean  |         | false | affiche la description du référentiel |
| attachRawData             |        | boolean  |         | false | ajoute l'objet rawData à la réponse |
| emitOccurenceOnBlur       |        | boolean  |         | false | emet l'occurence quand l'input perd le focus et uniquement si le référentiel est 'other/unknow' |
| **updateData**            |        | RepositoryItemModel |  |   | pour mettre à jour une donnée (bien spécifier l'occurenceId). Le module se met en mode 'isEditing', pré-rempli le champ de recherche, change le référentiel courant sur le référentiel de la donnée à éditer. Un événement updatedData ou cancelUpdateData est forcément renvoyé, selon l'action de l'utilisateur, avant de quitter le mode 'isEditing'
| reset                     |        | boolean  |          | false            | RAZ du composant si true |

### Paramètres en sortie @Output

| Propriété          | Valeur(s)                     | Remarque |
| ---                | ---                           | ---         |
| newData            | RepositoryItemModel           | newData est utilisé quand l'utilisateur à selecionné une donnée (hors édition) |
| updatedData        | RepositoryItemModel           | updatedData est utilisé quand l'utilisateur a selectionné une nouvelle valeur pour une donnée existante. |
| cancelUpdateData   | `{occurenceId: number}`       | cancelUpdateData est utilisé quand l'utilisateur à annulé l'édition d'une donnée. Renvoie l'id de l'occurence pour laquelle l'édition est annulée |
| selectedRepository | string                        | selectedRepository est renvoyé quand l'utilisateur à changé de référentiel (attention, aucune valeur n'est émise si le référentiel est changé automatiquement lors de l'édition d'une donnée) |
| allResults         | Array<RepositoryItemModel> \| null | allResults est renvoyé dès que l'utilisateur entre un terme dans le champ de recherche ET si l'option autoComplete === false. Je ne pense pas que ce soit utile pour le Cel. |


RepositoryItemModel :

| Propriété      | Type                | Commentaire |
| ---            | ---                 | ---         |
| occurenceId    | number              | optionnel. id de l'occurence. Lors d'une édition, le champ est renseigné |
| repository     | string              |
| idNomen        | number \| string    |
| idTaxo         | number \| string    | optionnel   |
| name           | string              |
| author         | string              |
| isSynonym      | boolean             | optionnel   |
| rawData        | any                 | optionnel. Contient les données brutes (de l'occurence) issues du référentiel   |
| validOccurence | RepositoryItemModel | optionnel. Peut avoir les propriétés `idNomen`, `idTaxo`, `name`, `author` égales à "NA" si aucune occurence valide n'a été trouvée dans le référentiel |

## Serveur de développement

Ne pas oublier de reconstruire la librairie avant de servir l'application (`npm run build_serve` fait les deux à la suite).

## Build
-  `npm run build_lib` pour construire la librairie
-  `npm run build_serve` pour construire la librairie et servir l'application principale
-  `npm run build_pack` for construire et packager la librairie


> The --prod meta-flag compiles with AOT by default.


Le build et la package sont dans le répertoire `dist/`.

## Tests unitaires
`ng test`

## Tests e2e
`ng e2e`