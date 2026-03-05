const ts = require('typescript');
const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
        const dirFile = path.join(dir, file);
        try {
            filelist = walkSync(dirFile, filelist);
        } catch (err) {
            if (err.code === 'ENOTDIR' || err.code === 'EBADF') {
                if (dirFile.endsWith('.ts') || dirFile.endsWith('.tsx')) {
                    filelist.push(dirFile);
                }
            }
        }
    });
    return filelist;
};

const appDir = path.join(__dirname, '../client/src');
const files = walkSync(appDir);

const results = [];

function extractApiCalls(sourceFile) {
    function visit(node) {
        if (ts.isCallExpression(node)) {
            const expression = node.expression;
            if (ts.isIdentifier(expression)) {
                const text = expression.text;
                if (['useGet', 'usePost', 'usePut', 'useDelete'].includes(text)) {
                    // Get Type Arguments
                    const typeArgs = node.typeArguments ? node.typeArguments.map(t => t.getText(sourceFile)) : [];
                    // Get URL Argument
                    const urlArg = node.arguments[0] ? node.arguments[0].getText(sourceFile) : null;

                    results.push({
                        file: sourceFile.fileName.replace(appDir, ''),
                        method: text,
                        typeArgs,
                        urlArg
                    });
                }
            }
        }
        ts.forEachChild(node, visit);
    }
    visit(sourceFile);
}

files.forEach(file => {
    const sourceCode = fs.readFileSync(file, 'utf8');
    const sourceFile = ts.createSourceFile(
        file,
        sourceCode,
        ts.ScriptTarget.Latest,
        true
    );
    extractApiCalls(sourceFile);
});

fs.writeFileSync(path.join(__dirname, 'client_ast_api_calls.json'), JSON.stringify(results, null, 2));
console.log(`Extracted ${results.length} API calls using AST`);
