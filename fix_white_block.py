import os

mock_data_path = "/Users/param/crazyones/Event/nativeapp/src/data/mockData.js"
home_screen_path = "/Users/param/crazyones/Event/nativeapp/src/screens/HomeScreen.js"
mock_server_path = "/Users/param/crazyones/Event/backend/mock-server.js"

# 1. Update mockData.js
with open(mock_data_path, 'r') as f:
    mock_content = f.read()

mock_content = mock_content.replace(
    "{ id: '2', name: 'Web3', icon: '🌐', lottie: require('../../assets/Bitcoin 3d Outline Icon Animation.json') },",
    "{ id: '2', name: 'Web3', icon: '🌐', lottie: require('../../assets/Bitcoin 3d Outline Icon Animation.json'), recolor: '#FFFFFF' },"
)
with open(mock_data_path, 'w') as f:
    f.write(mock_content)

# 2. Update HomeScreen.js
with open(home_screen_path, 'r') as f:
    home_content = f.read()

old_color_filters = """                          colorFilters={[
                            {
                              keypath: "**",
                              color: "#FFFFFF"
                            }
                          ]}"""
new_color_filters = """                          colorFilters={cat.recolor ? [{ keypath: "**", color: cat.recolor }] : []}"""

home_content = home_content.replace(old_color_filters, new_color_filters)
with open(home_screen_path, 'w') as f:
    f.write(home_content)

# 3. Update mock-server.js
with open(mock_server_path, 'r') as f:
    server_content = f.read()

old_events = """const MOCK_EVENTS = [
  { id: '1', title: 'Google I/O 2026', date: '2026-05-14', location: 'Mountain View, CA', description: 'Annual developer conference.', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87' },
  { id: '2', title: 'WWDC 2026', date: '2026-06-08', location: 'Cupertino, CA', description: 'Worldwide Developers Conference.', image: 'https://images.unsplash.com/photo-1515169067868-5387ec356754' }
];"""

new_events = """const MOCK_EVENTS = [
  { id: '1', title: 'Google I/O 2026', date: '2026-05-14', location: 'Mountain View, CA', description: 'Annual developer conference.', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87' },
  { id: '2', title: 'WWDC 2026', date: '2026-06-08', location: 'Cupertino, CA', description: 'Worldwide Developers Conference.', image: 'https://images.unsplash.com/photo-1515169067868-5387ec356754' },
  { id: '3', title: 'AWS Student Community Day', date: '2026-09-20', location: 'Bengaluru, India', description: 'Join students and AWS experts to learn about cloud computing, AI, and serverless architectures.', image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1' },
  { id: '4', title: 'D4 Community Day', date: '2026-11-12', location: 'Virtual', description: 'Design, Develop, Deploy, and Disrupt. The ultimate community gathering for modern builders.', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b' }
];"""

server_content = server_content.replace(old_events, new_events)
with open(mock_server_path, 'w') as f:
    f.write(server_content)

print("Updated data and fixed lottie color filter issue.")
