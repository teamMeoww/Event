import os

filepath = "/Users/param/crazyones/Event/nativeapp/src/screens/HomeScreen.js"

with open(filepath, 'r') as f:
    content = f.read()

old_render = """                        <LottieView
                          source={cat.lottie}
                          autoPlay
                          loop
                          style={{ width: 44, height: 44, marginBottom: 5 }}
                        />"""

new_render = """                        <LottieView
                          source={cat.lottie}
                          autoPlay
                          loop
                          colorFilters={[
                            {
                              keypath: "**",
                              color: "#FFFFFF"
                            }
                          ]}
                          style={{ width: 44, height: 44, marginBottom: 5 }}
                        />"""

content = content.replace(old_render, new_render)

with open(filepath, 'w') as f:
    f.write(content)

print("Added colorFilters to LottieView")
