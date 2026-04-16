// Fix triple/double encoded UTF-8 Arabic text in HTML files
const fs = require('fs');

function fixMojibake(text) {
    // Pattern: sequences of chars in range \x80-\xFF that form valid UTF-8 when converted back to bytes
    let result = '';
    let i = 0;
    
    while (i < text.length) {
        const code = text.charCodeAt(i);
        
        if (code < 0x80) {
            // Plain ASCII - keep as-is
            result += text[i];
            i++;
        } else if (code >= 0x80 && code <= 0xFF) {
            // Potential mojibake sequence - collect consecutive chars in 0x80-0xFF range
            let byteArr = [];
            let j = i;
            while (j < text.length && text.charCodeAt(j) >= 0x80 && text.charCodeAt(j) <= 0xFF) {
                byteArr.push(text.charCodeAt(j));
                j++;
            }
            
            // Try to decode the byte sequence as UTF-8
            const buf = Buffer.from(byteArr);
            try {
                const decoded = buf.toString('utf8');
                // Check if decoded is valid (no replacement chars)
                if (!decoded.includes('\uFFFD')) {
                    result += decoded;
                } else {
                    // Can't fix, keep original
                    result += text.substring(i, j);
                }
            } catch(e) {
                result += text.substring(i, j);
            }
            i = j;
        } else {
            // Higher unicode - already proper Unicode char
            result += text[i];
            i++;
        }
    }
    return result;
}

function processFile(filepath) {
    console.log('Processing:', filepath);
    
    // Read file as binary buffer, then decode as latin-1 (1-to-1 mapping)
    const raw = fs.readFileSync(filepath);
    // Convert bytes to string using latin-1 (each byte maps to same code point)
    let text = '';
    for (let i = 0; i < raw.length; i++) {
        text += String.fromCharCode(raw[i]);
    }
    
    // Fix the mojibake
    const fixed = fixMojibake(text);
    
    // Write back as UTF-8
    fs.writeFileSync(filepath, fixed, 'utf8');
    console.log('  Saved!');
}

const files = [
    'C:\\My Web Sites\\test\\tallo-menu\\menu-ar.html',
    'C:\\My Web Sites\\test\\tallo-menu\\menu-en.html',
];

for (const f of files) {
    if (fs.existsSync(f)) {
        try {
            processFile(f);
        } catch(e) {
            console.error('  ERROR:', e.message);
        }
    } else {
        console.log('NOT FOUND:', f);
    }
}

console.log('All done!');
