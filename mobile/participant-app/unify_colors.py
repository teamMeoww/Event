import os

filepath = "/Users/param/crazyones/Event/nativeapp/src/screens/WalletScreen.js"

with open(filepath, 'r') as f:
    content = f.read()

# Fix background orbs to match the blue/indigo theme
content = content.replace("rgba(0, 255, 157, 0.15)", "rgba(94, 92, 230, 0.25)")
content = content.replace("rgba(94, 92, 230, 0.2)", "rgba(10, 132, 255, 0.2)")

# Replace the neon green with the app's standard indigo accent
content = content.replace("#00FF9D", "#8c8cff")

# Replace the rgba variations of the green with the indigo equivalents
content = content.replace("rgba(0, 255, 157, 0.1)", "rgba(140, 140, 255, 0.1)")
content = content.replace("rgba(0, 255, 157, 0.05)", "rgba(140, 140, 255, 0.05)")
content = content.replace("rgba(0, 255, 157, 0.2)", "rgba(140, 140, 255, 0.2)")
content = content.replace("rgba(0,255,157,0.2)", "rgba(140,140,255,0.2)")

with open(filepath, 'w') as f:
    f.write(content)

print("Unified colors in WalletScreen.js")
