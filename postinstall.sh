(grep -v '#' $1/ios/Podfile | grep -q 'use_frameworks' && echo already exists) || sed -i -e '/platform\ \:ios/a\'$'\n''use_frameworks!\'$'\n' $1/ios/Podfile ; sed -i -e '/flipper/ s/^#*/#/' $1/ios/Podfile