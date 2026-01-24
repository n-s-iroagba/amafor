
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function findPageFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(findPageFiles(file));
        } else {
            if (file.endsWith('page.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const rootDir = '/home/udorakpuenyi/amafor/client/src/app';
const files = findPageFiles(rootDir);

console.log('Unannotated Files:');
files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    if (!content.includes(' * Requirements:')) {
        console.log(file);
    }
});
