import os

filepath = "/Users/param/crazyones/Event/nativeapp/src/screens/WalletScreen.js"

with open(filepath, 'r') as f:
    content = f.read()

old_render = "<Text style={styles.credentialType}>{cred.type}</Text>"
new_render = '<Ionicons name={cred.type} size={28} color="#8c8cff" />'

content = content.replace(old_render, new_render)

with open(filepath, 'w') as f:
    f.write(content)

print("Updated WalletScreen rendering for badges")
