import os

filepath = "/Users/param/crazyones/Event/nativeapp/src/screens/HomeScreen.js"

with open(filepath, 'r') as f:
    content = f.read()

old_image = "<Image source={event.image || { uri: event.image }} style={styles.recommendedImage} />"
new_image = """<Image 
                        source={event.id === '1' ? require('../../assets/1148-GC-IO-Header-GC-43-0519.max-2500x2500.jpg') : (typeof event.image === 'string' ? { uri: event.image } : event.image)} 
                        style={styles.recommendedImage} 
                      />"""

content = content.replace(old_image, new_image)

with open(filepath, 'w') as f:
    f.write(content)

print("Updated HomeScreen to use local Google I/O image and fix string URI bug")
