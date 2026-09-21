const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'frontends', 'jinja2');

let count = 0;
fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
        let content = fs.readFileSync(path.join(dir, file), 'utf8');
        let originalContent = content;
        
        // This regex finds window.location.href='something.html...' or href="something.html..."
        // It's safer to just replace any word.html inside quotes.
        
        // Replace .html in href="..."
        content = content.replace(/href="(?!(?:http|https|mailto|tel):)([^"]+?)\.html([#?][^"]*)?"/g, (match, pathPart, queryHash) => {
            let cleanPath = pathPart.replace(/^(\.\/|\/)/, '');
            let extra = queryHash || '';
            if (cleanPath === 'index') return `href="/${extra}"`;
            return `href="/${cleanPath}${extra}"`;
        });
        
        // Replace .html in href='...' or window.location.href='...'
        content = content.replace(/href='(?!(?:http|https|mailto|tel):)([^']+?)\.html([#?][^']*)?'/g, (match, pathPart, queryHash) => {
            let cleanPath = pathPart.replace(/^(\.\/|\/)/, '');
            let extra = queryHash || '';
            if (cleanPath === 'index') return `href='/${extra}'`;
            return `href='/${cleanPath}${extra}'`;
        });
        
        // Replace window.location.href="something.html"
        content = content.replace(/href="([^"]+?)\.html([#?][^"]*)?"/g, (match, pathPart, queryHash) => {
            if (match.includes("http")) return match; // skip external
            let cleanPath = pathPart.replace(/^(\.\/|\/)/, '');
            let extra = queryHash || '';
            if (cleanPath === 'index') return `href="/${extra}"`;
            return `href="/${cleanPath}${extra}"`;
        });
        
        // Also handle onclick="window.location.href='something'"
        content = content.replace(/href='([^']+?)\.html([#?][^']*)?'/g, (match, pathPart, queryHash) => {
            if (match.includes("http")) return match;
            let cleanPath = pathPart.replace(/^(\.\/|\/)/, '');
            let extra = queryHash || '';
            if (cleanPath === 'index') return `href='/${extra}'`;
            return `href='/${cleanPath}${extra}'`;
        });
        
        // Final pass for window.location.href = "something.html" or window.location.href='index'
        content = content.replace(/window\.location\.href\s*=\s*(['"])([^'"]+?)\.html([#?][^'"]*)?\1/g, (match, quote, pathPart, queryHash) => {
            let cleanPath = pathPart.replace(/^(\.\/|\/)/, '');
            let extra = queryHash || '';
            if (cleanPath === 'index') return `window.location.href = ${quote}/${extra}${quote}`;
            return `window.location.href = ${quote}/${cleanPath}${extra}${quote}`;
        });
        
        // Specifically fix `window.location.href='index'` in programs.html
        content = content.replace(/window\.location\.href\s*=\s*'index'/g, "window.location.href='/'");
        
        if (content !== originalContent) {
            fs.writeFileSync(path.join(dir, file), content, 'utf8');
            console.log(`Updated links in ${file}`);
            count++;
        }
    }
});
console.log(`Updated ${count} files.`);
