import os

filepath = "/Users/param/crazyones/Event/nativeapp/src/screens/HomeScreen.js"

with open(filepath, 'r') as f:
    content = f.read()

# Remove the waving hand emoji
old_greeting = "<Text style={styles.greeting}>Good evening, {mockUser.name} 👋</Text>"
new_greeting = "<Text style={styles.greeting}>Good evening, {mockUser.name}</Text>"
content = content.replace(old_greeting, new_greeting)

# Increase the LottieView size
old_lottie = "style={{ width: 44, height: 44 }}"
new_lottie = "style={{ width: 85, height: 85, marginRight: -10 }}" # slight negative margin to hug the edge nicely
content = content.replace(old_lottie, new_lottie)

# Increase the avatarContainer size
old_avatar = """  avatarContainer: { 
    width: 50, 
    height: 50, 
    alignItems: 'center', 
    justifyContent: 'center', 
  },"""

new_avatar = """  avatarContainer: { 
    width: 80, 
    height: 80, 
    alignItems: 'center', 
    justifyContent: 'center', 
  },"""
content = content.replace(old_avatar, new_avatar)

with open(filepath, 'w') as f:
    f.write(content)

print("Removed emoji and increased avatar size")
