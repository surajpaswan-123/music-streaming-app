#!/bin/bash

# PWA Icon Generator Script
# Generates all required icon sizes from a source image

echo "🎨 PWA Icon Generator"
echo "===================="
echo ""

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found!"
    echo ""
    echo "Please install ImageMagick:"
    echo "  macOS:   brew install imagemagick"
    echo "  Ubuntu:  sudo apt-get install imagemagick"
    echo "  Windows: Download from https://imagemagick.org/script/download.php"
    exit 1
fi

# Check if source image is provided
if [ -z "$1" ]; then
    echo "Usage: ./generate-icons.sh <source-image.png>"
    echo ""
    echo "Example: ./generate-icons.sh logo.png"
    echo ""
    echo "Source image should be at least 512x512 pixels"
    exit 1
fi

SOURCE_IMAGE="$1"

# Check if source image exists
if [ ! -f "$SOURCE_IMAGE" ]; then
    echo "❌ Source image not found: $SOURCE_IMAGE"
    exit 1
fi

# Create icons directory if it doesn't exist
mkdir -p frontend/public/icons

echo "📦 Generating icons from: $SOURCE_IMAGE"
echo ""

# Array of icon sizes
SIZES=(72 96 128 144 152 192 384 512)

# Generate each size
for SIZE in "${SIZES[@]}"; do
    OUTPUT="frontend/public/icons/icon-${SIZE}x${SIZE}.png"
    echo "  Creating ${SIZE}x${SIZE}..."
    convert "$SOURCE_IMAGE" -resize ${SIZE}x${SIZE} "$OUTPUT"
    
    if [ $? -eq 0 ]; then
        echo "  ✅ Created: $OUTPUT"
    else
        echo "  ❌ Failed to create: $OUTPUT"
    fi
done

echo ""
echo "✅ Icon generation complete!"
echo ""
echo "Generated icons:"
ls -lh frontend/public/icons/

echo ""
echo "Next steps:"
echo "1. Verify icons look good"
echo "2. Commit and push to GitHub"
echo "3. Deploy to Vercel"
echo "4. Test PWA installation"
