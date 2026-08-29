import os

filepath = "/Users/param/crazyones/Event/nativeapp/src/data/mockData.js"

with open(filepath, 'r') as f:
    content = f.read()

old_mock = "  { id: '3', name: 'Design', icon: '🎨' },"
new_mock = "  { id: '3', name: 'Design', icon: '🎨', lottie: require('../../assets/painting.json') },"
content = content.replace(old_mock, new_mock)

with open(filepath, 'w') as f:
    f.write(content)

print("Updated mockData.js with painting animation for Design category")
