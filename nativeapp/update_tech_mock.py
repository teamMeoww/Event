import os

filepath = "/Users/param/crazyones/Event/nativeapp/src/data/mockData.js"

with open(filepath, 'r') as f:
    content = f.read()

old_mock = "  { id: '1', name: 'Tech', icon: '💻' },"
new_mock = "  { id: '1', name: 'Tech', icon: '💻', lottie: require('../../assets/CMS computer animation.json') },"
content = content.replace(old_mock, new_mock)

with open(filepath, 'w') as f:
    f.write(content)

print("Updated mockData.js with CMS computer animation for Tech category")
