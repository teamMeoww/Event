import os
import glob

# Function to enhance card styles in a given file
def enhance_cards(filepath):
    if not os.path.exists(filepath):
        return

    with open(filepath, 'r') as f:
        content = f.read()

    # 1. Base color: muddy dark grey -> bright sheer white
    content = content.replace("backgroundColor: 'rgba(20, 20, 20, 0.4)'", "backgroundColor: 'rgba(255, 255, 255, 0.03)'")
    content = content.replace("backgroundColor: 'rgba(20, 20, 20, 0.5)'", "backgroundColor: 'rgba(255, 255, 255, 0.03)'")
    
    # 2. Gradient enhancements
    content = content.replace("['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.0)']", "['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.0)']")
    content = content.replace("['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.01)']", "['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.0)']")
    content = content.replace("['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.0)']", "['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.0)']")
    
    # 3. Border enhancements
    content = content.replace("borderColor: 'rgba(255, 255, 255, 0.15)'", "borderColor: 'rgba(255, 255, 255, 0.1)'")
    content = content.replace("borderTopColor: 'rgba(255, 255, 255, 0.3)'", "borderTopWidth: 1.5, borderTopColor: 'rgba(255, 255, 255, 0.4)', borderLeftWidth: 1, borderLeftColor: 'rgba(255, 255, 255, 0.2)'")
    content = content.replace("borderTopColor: 'rgba(255, 255, 255, 0.25)'", "borderTopWidth: 1.5, borderTopColor: 'rgba(255, 255, 255, 0.35)', borderLeftWidth: 1, borderLeftColor: 'rgba(255, 255, 255, 0.15)'")

    # 4. Blur Intensities
    content = content.replace("intensity={50}", "intensity={80}")
    content = content.replace("intensity={60}", "intensity={85}")
    content = content.replace("intensity={70}", "intensity={90}")

    with open(filepath, 'w') as f:
        f.write(content)


screens = [
    "/Users/param/crazyones/Event/nativeapp/src/screens/HomeScreen.js",
    "/Users/param/crazyones/Event/nativeapp/src/screens/PassportScreen.js",
    "/Users/param/crazyones/Event/nativeapp/src/screens/WalletScreen.js"
]

for screen in screens:
    enhance_cards(screen)

print("Improved cards on Home, Passport, and Wallet screens.")
