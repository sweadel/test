// Fix triple-encoded UTF-8 Arabic text
// The file on disk has bytes like:
// \xc3\x98\xc2\xb7 which represents Arabic ط
// These are UTF-8 encodings of Latin-1 characters \xd8\xb7 which is UTF-8 for ط
// Fix: read raw bytes, decode as latin-1 (1:1), convert each char back to its byte,
//      then decode as UTF-8

const fs = require('fs');

function fixFile(filepath) {
    console.log('Processing:', filepath);
    
    // Read raw bytes
    const rawBuf = fs.readFileSync(filepath);
    
    // The bytes on disk are the correct UTF-8 representation of the orignal Arabic text
    // that was double-encoded. We need to:
    // 1. Decode the raw bytes as UTF-8 -> gives mojibake string
    // 2. For each char in the mojibake, take its code point (all are <=0xFF)
    // 3. Reassemble as bytes
    // 4. Decode those bytes as UTF-8 -> correct Arabic
    
    // But first let's verify: what is the raw byte at the title?
    // \xc3\x98 \xc2\xb7 -> decoded as UTF-8 -> chr(0xD8) chr(0xB7) -> 0xD8B7 = ط in UTF-8!
    // Wait: chr(0xD8) = Ø and chr(0xB7) = · -> That's "Ø·" which is what we see!
    // So the bytes \xc3\x98\xc2\xb7 decode to the mojibake "Ø·"
    // Each mojibake char in range 0x80..0xFF represents a UTF-8 byte
    // We need to collect these and re-decode as UTF-8
    
    // Step 1: Read file as raw bytes
    const bytes = new Uint8Array(rawBuf);
    
    // Step 2: Process byte by byte, fixing mojibake sequences
    const outputChunks = [];
    let i = 0;
    
    while (i < bytes.length) {
        const b = bytes[i];
        
        if (b < 0x80) {
            // ASCII - keep as-is
            outputChunks.push(b);
            i++;
        } else if (b >= 0xC0 && b <= 0xEF) {
            // Start of a UTF-8 multi-byte sequence
            // Determine how many bytes follow
            let seqLen;
            if (b >= 0xE0) seqLen = 3;
            else seqLen = 2;
            
            // Read the full sequence
            const seq = bytes.slice(i, i + seqLen);
            
            // Decode this sequence as UTF-8 to get the code point
            try {
                const decoded = Buffer.from(seq).toString('utf8');
                const cp = decoded.codePointAt(0);
                
                if (cp >= 0x80 && cp <= 0xFF) {
                    // This is a mojibake char - its code point IS the original UTF-8 byte
                    outputChunks.push(cp);
                } else if (cp > 0xFF) {
                    // This is a legitimate multi-byte UTF-8 char (e.g. Arabic > U+0100)
                    // But wait - Arabic is U+0600..U+06FF which is > 0xFF
                    // These should have been properly stored... 
                    // Actually if we see \xd8\xb7 (U+0637 = ط), that's GOOD Arabic UTF-8
                    // Keep as-is - push the original bytes
                    for (let k = 0; k < seq.length; k++) {
                        outputChunks.push(seq[k]);
                    }
                } else {
                    // ASCII from multi-byte? Shouldn't happen normally
                    for (let k = 0; k < seq.length; k++) {
                        outputChunks.push(seq[k]);
                    }
                }
                
                i += seqLen;
            } catch(e) {
                // Bad sequence - keep raw byte
                outputChunks.push(b);
                i++;
            }
        } else {
            // Continuation byte or other - keep as-is
            outputChunks.push(b);
            i++;
        }
    }
    
    // Now we have a mixture of:
    // - ASCII bytes
    // - Original Arabic UTF-8 bytes (already proper \xd8\xb7 etc)
    // - Reassembled original bytes from mojibake
    // Write them all as a buffer
    const outBuf = Buffer.from(outputChunks);
    
    // Verify it decodes as UTF-8
    try {
        const test = outBuf.toString('utf8');
        // Quick sanity check: should contain Arabic
        if (test.includes('طلو') || test.includes('فطور') || test.includes('سلطة')) {
            console.log('  Arabic found! Fix successful.');
        } else {
            console.log('  Warning: Arabic not found after fix. Checking content...');
            // Find first non-ASCII section
            const idx = outputChunks.findIndex(b => b > 0x7F);
            if (idx >= 0) {
                const sample = Buffer.from(outputChunks.slice(idx, idx+30));
                console.log('  Sample bytes:', sample.toString('hex'));
                console.log('  Sample utf8:', sample.toString('utf8'));
            }
        }
    } catch(e) {
        console.log('  UTF-8 decode failed:', e.message);
        return;
    }
    
    fs.writeFileSync(filepath, outBuf);
    console.log('  Saved!');
}

const files = [
    'C:\\My Web Sites\\test\\tallo-menu\\menu-ar.html',
    'C:\\My Web Sites\\test\\tallo-menu\\menu-en.html',
];

for (const f of files) {
    if (fs.existsSync(f)) {
        try {
            fixFile(f);
        } catch(e) {
            console.error('  ERROR:', e.message);
        }
    }
}

console.log('Done!');
