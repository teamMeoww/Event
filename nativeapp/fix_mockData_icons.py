import os

filepath = "/Users/param/crazyones/Event/nativeapp/src/data/mockData.js"

with open(filepath, 'r') as f:
    content = f.read()

content = content.replace("type: '🏆',", "type: 'hardware-chip-outline',")
content = content.replace("type: '🎤',", "type: 'terminal-outline',")
content = content.replace("type: '🥇',", "type: 'cube-outline',")

with open(filepath, 'w') as f:
    f.write(content)

print("Updated mockData icons")
