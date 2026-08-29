import os
import re

files = [
    "/Users/param/crazyones/Event/nativeapp/src/screens/HomeScreen.js",
    "/Users/param/crazyones/Event/nativeapp/src/screens/DiscoverScreen.js",
    "/Users/param/crazyones/Event/nativeapp/src/screens/PassportScreen.js",
    "/Users/param/crazyones/Event/nativeapp/src/screens/WalletScreen.js"
]

for filepath in files:
    if not os.path.exists(filepath):
        continue
    
    with open(filepath, 'r') as f:
        content = f.read()

    # 1. Remove glowOrbs from JSX
    content = re.sub(r"<View style=\{\[styles\.glowOrb[^>]+>\s*", "", content)
    
    # 2. Change container background to matte black
    content = content.replace("backgroundColor: '#050505'", "backgroundColor: '#000000'")
    content = content.replace("backgroundColor: '#0F0F13'", "backgroundColor: '#000000'")
    content = content.replace("backgroundColor: '#0A0C10'", "backgroundColor: '#000000'")

    # 3. Remove glowOrb style definition
    content = re.sub(r"glowOrb:\s*\{[^}]+\},\s*", "", content)

    # 4. If glass cards are completely on black, we might need a tiny bit of contrast, 
    # but the glass cards already have `backgroundColor: 'rgba(255, 255, 255, 0.03)'` and `borderWidth`.
    # They should look incredibly sleek on pure black.

    with open(filepath, 'w') as f:
        f.write(content)

print("Removed glow orbs and applied matte black backgrounds.")
