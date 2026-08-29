import os

filepath = "/Users/param/crazyones/Event/nativeapp/src/screens/WalletScreen.js"

with open(filepath, 'r') as f:
    content = f.read()

# Replace View style={{height: 60}} with logout button
old_view = "<View style={{height: 60}} />"
new_view = """          <TouchableOpacity style={styles.logoutButton} onPress={() => logout()}>
            <Ionicons name="log-out-outline" size={20} color="#FF453A" style={{marginRight: 8}} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
          <View style={{height: 60}} />"""

content = content.replace(old_view, new_view)

# Add styles
old_style = "credentialStatus: { fontSize: 11, color: '#8c8cff', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }"
new_style = """credentialStatus: { fontSize: 11, color: '#8c8cff', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  logoutButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 16, 
    marginTop: 20, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 69, 58, 0.3)', 
    backgroundColor: 'rgba(255, 69, 58, 0.1)' 
  },
  logoutText: { color: '#FF453A', fontSize: 16, fontWeight: '700' }"""

content = content.replace(old_style, new_style)

with open(filepath, 'w') as f:
    f.write(content)

print("Logout button definitely added")
