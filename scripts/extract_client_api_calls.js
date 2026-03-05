const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    } catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBADF') filelist.push(dirFile);
    }
  });
  return filelist;
};

const appDir = path.join(__dirname, '../client/src/app');
const files = walkSync(appDir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

const results = [];
const regex = /use(Get|Post|Put|Delete)(?:<([^>]+)>)?\(\s*[`'"]([^`'"]+)[`'"]/g;
const regex2 = /use(Get|Post|Put|Delete)(?:<([^>]+)>)?\(\s*([^,)]+)/g;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = regex2.exec(content)) !== null) {
      // Ignore if it's just importing or definition
      if (match[3] && !match[3].startsWith('resourceUrl') && !match[3].startsWith('putUrl') && !match[3].startsWith('postResourceUrl')) {
         results.push({
             file: file.replace(appDir, ''),
             method: match[1],
             types: match[2] || 'any',
             urlArg: match[3].trim()
         });
      }
  }
});

fs.writeFileSync(path.join(__dirname, 'client_api_calls.json'), JSON.stringify(results, null, 2));
console.log(`Extracted ${results.length} API calls`);
