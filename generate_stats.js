const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'dummy_languages');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

// 55 languages
const languages = [
    { ext: '.asm', name: 'Assembly', size: 1500000 }, // Assembly at the top (1.5 MB)
    { ext: '.bf', name: 'Brainfuck', size: 1200000 }, // Brainfuck second (1.2 MB)
    { ext: '.cpp', name: 'C++', size: 10000 },
    { ext: '.c', name: 'C', size: 9000 },
    { ext: '.rs', name: 'Rust', size: 8000 },
    { ext: '.hs', name: 'Haskell', size: 7000 },
    { ext: '.erl', name: 'Erlang', size: 6000 },
    { ext: '.ex', name: 'Elixir', size: 5500 },
    { ext: '.clj', name: 'Clojure', size: 5000 },
    { ext: '.lisp', name: 'Common Lisp', size: 4500 },
    { ext: '.ml', name: 'OCaml', size: 4000 },
    { ext: '.fs', name: 'F#', size: 3800 },
    { ext: '.java', name: 'Java', size: 3500 },
    { ext: '.cs', name: 'C#', size: 3400 },
    { ext: '.go', name: 'Go', size: 3300 },
    { ext: '.rb', name: 'Ruby', size: 3200 },
    { ext: '.php', name: 'PHP', size: 3100 },
    { ext: '.py', name: 'Python', size: 3000 },
    { ext: '.ts', name: 'TypeScript', size: 2900 },
    { ext: '.js', name: 'JavaScript', size: 2800 },
    { ext: '.swift', name: 'Swift', size: 2700 },
    { ext: '.kt', name: 'Kotlin', size: 2600 },
    { ext: '.scala', name: 'Scala', size: 2500 },
    { ext: '.lua', name: 'Lua', size: 2400 },
    { ext: '.pl', name: 'Perl', size: 2300 },
    { ext: '.r', name: 'R', size: 2200 },
    { ext: '.jl', name: 'Julia', size: 2100 },
    { ext: '.dart', name: 'Dart', size: 2000 },
    { ext: '.sh', name: 'Shell', size: 1900 },
    { ext: '.bat', name: 'Batchfile', size: 1800 },
    { ext: '.ps1', name: 'PowerShell', size: 1700 },
    { ext: '.f90', name: 'Fortran', size: 1600 },
    { ext: '.cob', name: 'COBOL', size: 1500 },
    { ext: '.adb', name: 'Ada', size: 1400 },
    { ext: '.pro', name: 'Prolog', size: 1300 },
    { ext: '.scm', name: 'Scheme', size: 1200 },
    { ext: '.sql', name: 'SQL', size: 1100 },
    { ext: '.vue', name: 'Vue', size: 1000 },
    { ext: '.svelte', name: 'Svelte', size: 950 },
    { ext: '.xml', name: 'XML', size: 900 },
    { ext: '.yml', name: 'YAML', size: 850 },
    { ext: '.md', name: 'Markdown', size: 800 },
    { ext: '.vim', name: 'Vim script', size: 750 },
    { ext: '.el', name: 'Emacs Lisp', size: 700 },
    { ext: '.m', name: 'MATLAB', size: 650 },
    { ext: '.groovy', name: 'Groovy', size: 600 },
    { ext: '.vb', name: 'Visual Basic', size: 550 },
    { ext: '.pas', name: 'Pascal', size: 500 },
    { ext: '.d', name: 'D', size: 450 },
    { ext: '.nim', name: 'Nim', size: 400 },
    { ext: '.cr', name: 'Crystal', size: 350 },
    { ext: '.zig', name: 'Zig', size: 300 },
    { ext: '.v', name: 'V', size: 250 },
    { ext: '.hx', name: 'Haxe', size: 200 }
];

languages.forEach(lang => {
    let filename = `code${lang.ext}`;
    if (lang.ext === '.m') filename = `code_matlab.m`; // Object-C vs Matlab conflicts
    
    const filePath = path.join(dir, filename);
    
    // Generate dummy content
    let content = '';
    
    if (lang.ext === '.bf') {
        content = '+-<>[],.'.repeat(lang.size / 8);
    } else if (lang.ext === '.asm') {
        content = 'section .data\n'.repeat(lang.size / 14);
    } else {
        content = '// Code\n'.repeat(Math.ceil(lang.size / 8));
    }
    
    fs.writeFileSync(filePath, content);
});

console.log('50+ language files generated!');
