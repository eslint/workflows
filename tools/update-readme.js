/**
 * @fileoverview Script to update the README with sponsors details in all packages.
 *
 *   node tools/update-readme.js
 *
 * @author 루밀LuMir(lumirlumir)
 */

//-----------------------------------------------------------------------------
// Import
//-----------------------------------------------------------------------------

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';

//-----------------------------------------------------------------------------
// Data
//-----------------------------------------------------------------------------

const SPONSORS_URL = 'https://raw.githubusercontent.com/eslint/eslint.org/main/includes/sponsors.md';
const PACKAGES_README_FILE_PATHS = existsSync('./packages')
    ? readdirSync('./packages').map(dir => `./packages/${dir}/README.md`)
    : [];
const README_FILE_PATHS = ['./README.md', ...PACKAGES_README_FILE_PATHS];

//-----------------------------------------------------------------------------
// Main
//-----------------------------------------------------------------------------

const response = await fetch(SPONSORS_URL);
const allSponsors = await response.text();

README_FILE_PATHS.forEach(readmeFilePath => {
    const readme = readFileSync(readmeFilePath, 'utf8'); // Read README file

    let newReadme = readme.replace(
        /<!--sponsorsstart-->[\s\S]*?<!--sponsorsend-->/u,
        `<!--sponsorsstart-->\n\n${allSponsors}\n<!--sponsorsend-->`,
    );

    // replace multiple consecutive blank lines with just one blank line
    newReadme = newReadme.replace(/(?<=^|\n)\n{2,}/gu, '\n');

    // output to the files
    writeFileSync(readmeFilePath, newReadme, 'utf8');
});
