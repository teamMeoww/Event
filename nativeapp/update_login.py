import os

filepath = "/Users/param/crazyones/Event/nativeapp/src/screens/LoginScreen.js"
with open(filepath, "r") as f:
    content = f.read()

# Add import
import_statement = "import LottieView from 'lottie-react-native';\n"
content = content.replace("import { Ionicons } from '@expo/vector-icons';", "import { Ionicons } from '@expo/vector-icons';\n" + import_statement)

# Replace header
old_header = """          <View style={styles.header}>
            <Text style={styles.title}>EventOne.</Text>
            <Text style={styles.subtitle}>Sign in to your legacy account</Text>
          </View>"""

new_header = """          <View style={styles.header}>
            <View style={styles.titleRow}>
              <LottieView
                source={require('../../assets/android-icon-monochrome.json')}
                autoPlay
                loop
                style={styles.logoAnimation}
              />
              <Text style={styles.title}>EventOne.</Text>
            </View>
            <Text style={styles.subtitle}>Sign in to your legacy account</Text>
          </View>"""
content = content.replace(old_header, new_header)

# Add styles
old_title_style = """  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1.5,
    marginBottom: 8,
  },"""

new_title_style = """  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoAnimation: {
    width: 56,
    height: 56,
    marginRight: 8,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1.5,
  },"""
content = content.replace(old_title_style, new_title_style)

with open(filepath, "w") as f:
    f.write(content)

print("Updated LoginScreen with Lottie animation")
