import os

filepath = "/Users/param/crazyones/Event/nativeapp/src/screens/HomeScreen.js"

with open(filepath, 'r') as f:
    content = f.read()

old_render = """                      <Text style={styles.categoryIcon}>{cat.icon}</Text>"""
new_render = """                      {cat.lottie ? (
                        <LottieView
                          source={cat.lottie}
                          autoPlay
                          loop
                          style={{ width: 44, height: 44, marginBottom: 5 }}
                        />
                      ) : (
                        <Text style={styles.categoryIcon}>{cat.icon}</Text>
                      )}"""

content = content.replace(old_render, new_render)

with open(filepath, 'w') as f:
    f.write(content)

print("Updated HomeScreen to render lottie category icon")
