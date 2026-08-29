import os

filepath = "/Users/param/crazyones/Event/nativeapp/src/data/mockData.js"

with open(filepath, 'r') as f:
    content = f.read()

old_mock = "  { id: '2', name: 'Web3', icon: '🌐' },"
new_mock = "  { id: '2', name: 'Web3', icon: '🌐', lottie: require('../../assets/Bitcoin 3d Outline Icon Animation.json') },"
content = content.replace(old_mock, new_mock)

with open(filepath, 'w') as f:
    f.write(content)
