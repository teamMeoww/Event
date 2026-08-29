import os

filepath = "/Users/param/crazyones/Event/nativeapp/src/screens/HomeScreen.js"

with open(filepath, 'r') as f:
    content = f.read()

# Remove BlurView from the avatar container
old_avatar_render = """<TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.avatarContainer}>
                <BlurView tint="dark" intensity={80} style={StyleSheet.absoluteFillObject} />
                <LottieView"""

new_avatar_render = """<TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.avatarContainer}>
                <LottieView"""

content = content.replace(old_avatar_render, new_avatar_render)

# Update the avatarContainer style to remove borders and backgrounds completely
old_avatar_style = """  avatarContainer: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.2)', 
    alignItems: 'center', 
    justifyContent: 'center', 
    overflow: 'hidden' 
  },"""

new_avatar_style = """  avatarContainer: { 
    width: 50, 
    height: 50, 
    alignItems: 'center', 
    justifyContent: 'center', 
  },"""

content = content.replace(old_avatar_style, new_avatar_style)

with open(filepath, 'w') as f:
    f.write(content)

print("Removed circle border and background from avatar")
