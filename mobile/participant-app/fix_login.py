import os

filepath = "/Users/param/crazyones/Event/nativeapp/src/screens/LoginScreen.js"
with open(filepath, "r") as f:
    content = f.read()

# Swap Lottie and Text order
old_row = """            <View style={styles.titleRow}>
              <LottieView
                source={require('../../assets/android-icon-monochrome.json')}
                autoPlay
                loop
                style={styles.logoAnimation}
              />
              <Text style={styles.title}>EventOne.</Text>
            </View>"""

new_row = """            <View style={styles.titleRow}>
              <Text style={styles.title}>EventOne.</Text>
              <LottieView
                source={require('../../assets/android-icon-monochrome.json')}
                autoPlay
                loop
                style={styles.logoAnimation}
              />
            </View>"""
content = content.replace(old_row, new_row)

# Fix margins
old_style = """  logoAnimation: {
    width: 56,
    height: 56,
    marginRight: 8,
  },"""

new_style = """  logoAnimation: {
    width: 56,
    height: 56,
    marginLeft: 8,
  },"""
content = content.replace(old_style, new_style)

with open(filepath, "w") as f:
    f.write(content)

print("Moved Lottie to the right side.")
