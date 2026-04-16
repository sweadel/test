#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Fix double-encoded UTF-8 Arabic text in HTML files.
The original HTTrack-downloaded file had Arabic UTF-8 bytes
that were read as Latin-1 and then re-encoded as UTF-8 (mojibake).
"""
import os
import re

def fix_mojibake(text):
    """
    Convert mojibake text back to proper Arabic.
    Each mojibake char is <= 0xFF and originally a UTF-8 byte.
    We collect these chars and convert them back to proper UTF-8.
    """
    result = []
    i = 0
    chars = list(text)
    n = len(chars)
    
    while i < n:
        c = chars[i]
        code = ord(c)
        
        # ASCII range - keep as is
        if code < 0x80:
            result.append(c)
            i += 1
        # These are the double-encoded Arabic chars (all <= 0xFF)
        elif code <= 0xFF:
            # Collect consecutive non-ASCII chars that are <= 0xFF
            byte_seq = []
            while i < n and 0x80 <= ord(chars[i]) <= 0xFF:
                byte_seq.append(ord(chars[i]))
                i += 1
            # Try to decode as UTF-8
            try:
                arabic = bytes(byte_seq).decode('utf-8')
                result.append(arabic)
            except UnicodeDecodeError:
                # If can't decode, keep as is
                for b in byte_seq:
                    result.append(chr(b))
        else:
            # Already proper Unicode (>0xFF), keep as is
            result.append(c)
            i += 1
    
    return ''.join(result)

def process_file(filepath):
    print(f"Processing: {filepath}")
    
    with open(filepath, 'rb') as f:
        raw = f.read()
    
    # Decode as UTF-8
    try:
        text = raw.decode('utf-8')
    except UnicodeDecodeError:
        print(f"  ERROR: Cannot decode as UTF-8")
        return
    
    # Check if there's mojibake (chars in range 0x80-0xFF that form UTF-8 sequences)
    mojibake_pattern = re.compile(r'[\xc0-\xff][\x80-\xbf]+')
    if not mojibake_pattern.search(text):
        print(f"  No mojibake found, skipping.")
        return
    
    fixed = fix_mojibake(text)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(fixed)
    
    print(f"  Fixed and saved!")

files = [
    r'C:\My Web Sites\test\tallo-menu\menu-ar.html',
    r'C:\My Web Sites\test\tallo-menu\menu-en.html',
    r'C:\My Web Sites\test\tallo-menu\index.html',
    r'C:\My Web Sites\test\tallo-menu\opinion.html',
    r'C:\My Web Sites\test\tallo-menu\opinion-en.html',
    r'C:\My Web Sites\test\tallo-menu\css\style-1.8.css',
]

for f in files:
    if os.path.exists(f):
        process_file(f)
    else:
        print(f"NOT FOUND: {f}")

print("Done!")
