electron-packager . "Duskr Prelude" \
    –version-string.CompanyName="Duskr" \
    –version-string.ProductName="Prelude" \
    –version-string.ProductVersion="0.1.0" \
    --icon="icon.icns" \
    --platform=darwin \
    --asar=true \
    --arch=x64 \
    --out="build/" \
    --overwrite \
    --ignore=".DS_Store" \
    --ignore=".gitignore" \
    --ignore=".git" \
    --ignore="build.sh" \
    --ignore="build" \
