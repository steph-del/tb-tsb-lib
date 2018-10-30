const fs = require('fs-extra');
const concat = require('concat');

(async function build() {

    let projectName = 'tb-tsb-lib-app';

    const files = [
        './dist/'+ projectName +'/runtime.js',
        './dist/'+ projectName +'/polyfills.js',
        './dist/'+ projectName + '/scripts.js',
        './dist/'+ projectName +'/main.js'
    ];

    await fs.ensureDir('./dist/elements');
    await concat(files, './dist/elements/'+ projectName +'.js');
    await fs.copyFile(
        './dist/'+ projectName +'/styles.css',
        './dist/elements/styles.css'
    );
})();
