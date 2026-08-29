import os

filepath = "/Users/param/crazyones/Event/nativeapp/src/screens/HomeScreen.js"
with open(filepath, "r") as f:
    content = f.read()

# Add the LottieView import
import_stmt = "import LottieView from 'lottie-react-native';\n"
content = content.replace("import { AuthContext } from '../context/AuthContext';", "import { AuthContext } from '../context/AuthContext';\n" + import_stmt)

# Replace the logout button with the animated avatar
old_header = """<TouchableOpacity onPress={logout} style={styles.logoutBtn}>
              <Ionicons name="log-out-outline" size={24} color="#5E5CE6" />
            </TouchableOpacity>"""

new_header = """<TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.avatarContainer}>
              <LottieView
                source={require('../../assets/android-icon-monochrome.json')}
                autoPlay
                loop
                style={{ width: 44, height: 44 }}
              />
            </TouchableOpacity>"""

content = content.replace(old_header, new_header)

# Add avatarContainer style and remove logoutBtn style
old_style = "logoutBtn: { backgroundColor: 'rgba(94, 92, 230, 0.15)', padding: 10, borderRadius: 12 },"
new_style = "avatarContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255, 255, 255, 0.05)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },"

content = content.replace(old_style, new_style)

with open(filepath, "w") as f:
    f.write(content)

print("Added animated Lottie avatar to HomeScreen")
