$ErrorActionPreference = 'Stop'

function Fix-HtmlEncoding {
    param([string]$file)
    Write-Host "Processing $file ..."
    
    $bytes = [System.IO.File]::ReadAllBytes($file)
    $result = New-Object System.Collections.Generic.List[byte] ($bytes.Length)
    
    $i = 0
    $len = $bytes.Length
    
    while ($i -lt $len) {
        $b = $bytes[$i]
        
        if ($b -lt 0x80) {
            # Plain ASCII - keep
            $result.Add($b)
            $i++
        } elseif ($b -ge 0xC0 -and $b -le 0xDF) {
            # 2-byte UTF-8 sequence
            if ($i + 1 -lt $len) {
                $b2 = $bytes[$i + 1]
                if ($b2 -ge 0x80 -and $b2 -le 0xBF) {
                    # Decode code point
                    $cp = (($b -band 0x1F) -shl 6) -bor ($b2 -band 0x3F)
                    # All 2-byte sequences represent codepoints 0x80..0x7FF
                    # In our case, all non-ASCII bytes were originally single bytes (0x80..0xFF)
                    # that got UTF-8 encoded. So we always take the low byte.
                    $result.Add([byte]($cp -band 0xFF))
                    $i += 2
                } else {
                    $result.Add($b)
                    $i++
                }
            } else {
                $result.Add($b)
                $i++
            }
        } elseif ($b -ge 0xE0 -and $b -le 0xEF) {
            # 3-byte UTF-8 sequence 
            if ($i + 2 -lt $len) {
                $b2 = $bytes[$i + 1]
                $b3 = $bytes[$i + 2]
                if ($b2 -ge 0x80 -and $b2 -le 0xBF -and $b3 -ge 0x80 -and $b3 -le 0xBF) {
                    $cp = (($b -band 0x0F) -shl 12) -bor (($b2 -band 0x3F) -shl 6) -bor ($b3 -band 0x3F)
                    # Take the low byte regardless - all these were originally single bytes
                    $result.Add([byte]($cp -band 0xFF))
                    $i += 3
                } else {
                    $result.Add($b)
                    $i++
                }
            } else {
                $result.Add($b)
                $i++
            }
        } elseif ($b -ge 0xF0 -and $b -le 0xF7) {
            # 4-byte UTF-8 sequence
            if ($i + 3 -lt $len) {
                $b2 = $bytes[$i + 1]; $b3 = $bytes[$i + 2]; $b4 = $bytes[$i + 3]
                if ($b2 -ge 0x80 -and $b3 -ge 0x80 -and $b4 -ge 0x80) {
                    $cp = (($b -band 0x07) -shl 18) -bor (($b2 -band 0x3F) -shl 12) -bor (($b3 -band 0x3F) -shl 6) -bor ($b4 -band 0x3F)
                    $result.Add([byte]($cp -band 0xFF))
                    $i += 4
                } else { $result.Add($b); $i++ }
            } else { $result.Add($b); $i++ }
        } else {
            $result.Add($b)
            $i++
        }
    }
    
    [System.IO.File]::WriteAllBytes($file, $result.ToArray())
    Write-Host "  Done! Bytes: $($result.Count)"
}

Fix-HtmlEncoding 'C:\My Web Sites\test\tallo-menu\menu-ar.html'
Fix-HtmlEncoding 'C:\My Web Sites\test\tallo-menu\menu-en.html'
Write-Host "All fixed!"
