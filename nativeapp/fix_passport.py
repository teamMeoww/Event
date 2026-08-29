import os

filepath = "/Users/param/crazyones/Event/nativeapp/src/screens/PassportScreen.js"

with open(filepath, 'r') as f:
    content = f.read()

# Add Ionicons import
content = content.replace(
    "import { BlurView } from 'expo-blur';",
    "import { BlurView } from 'expo-blur';\nimport { Ionicons } from '@expo/vector-icons';"
)

# Replace Text with Ionicons
old_tag = "<Text style={styles.credentialIcon}>{cred.type}</Text>"
new_tag = '<Ionicons name={cred.type} size={28} color="#8c8cff" />'

content = content.replace(old_tag, new_tag)

with open(filepath, 'w') as f:
    f.write(content)

print("Fixed PassportScreen icons")
