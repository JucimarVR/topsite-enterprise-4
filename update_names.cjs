const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        if (file.startsWith('node_modules') || file.startsWith('.git') || file.startsWith('dist')) return;
        
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Replace names
    content = content.replace(/Vélios Capital/gi, 'Rocha Capital');
    content = content.replace(/Velios Capital/gi, 'Rocha Capital');
    content = content.replace(/Vélios Server/gi, 'TopSite Enterprise');
    content = content.replace(/Velios Server/gi, 'TopSite Enterprise');
    content = content.replace(/velioscapital\.com\.br/g, 'rocha.com.br'); // They mentioned velios.com.br -> rocha.com.br but code has velioscapital.com.br
    content = content.replace(/velios\.com\.br/g, 'rocha.com.br');
    content = content.replace(/Vélios/gi, 'Rocha');
    content = content.replace(/Velios/gi, 'Rocha');
    content = content.replace(/velios/g, 'rocha');

    // Update Dário
    content = content.replace(/Sr\. Dário/g, 'Sr. Dário Corsi');
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});
