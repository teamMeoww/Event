import os

filepath = "/Users/param/crazyones/Event/nativeapp/ios/Podfile"

with open(filepath, 'r') as f:
    content = f.read()

target_block = """    react_native_post_install(
      installer,
      config[:reactNativePath],
      :mac_catalyst_enabled => false,
      :ccache_enabled => ccache_enabled?(podfile_properties),
    )"""

replacement_block = """    react_native_post_install(
      installer,
      config[:reactNativePath],
      :mac_catalyst_enabled => false,
      :ccache_enabled => ccache_enabled?(podfile_properties),
    )
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '16.4'
      end
    end"""

if target_block in content:
    content = content.replace(target_block, replacement_block)
    with open(filepath, 'w') as f:
        f.write(content)
    print("Podfile updated successfully.")
else:
    print("Could not find target block in Podfile.")
