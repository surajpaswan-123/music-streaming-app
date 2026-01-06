# PWA Icons

This directory contains the app icons for the Progressive Web App.

## Required Icons

You need to create the following icon sizes:

- `icon-72x72.png` (72x72 pixels)
- `icon-96x96.png` (96x96 pixels)
- `icon-128x128.png` (128x128 pixels)
- `icon-144x144.png` (144x144 pixels)
- `icon-152x152.png` (152x152 pixels)
- `icon-192x192.png` (192x192 pixels)
- `icon-384x384.png` (384x384 pixels)
- `icon-512x512.png` (512x512 pixels)

## How to Generate Icons

### Option 1: Use an Online Tool
1. Go to https://realfavicongenerator.net/ or https://www.pwabuilder.com/imageGenerator
2. Upload your logo/icon (minimum 512x512 PNG)
3. Download the generated icons
4. Place them in this directory

### Option 2: Use ImageMagick (Command Line)
```bash
# Install ImageMagick first
# macOS: brew install imagemagick
# Ubuntu: sudo apt-get install imagemagick

# Generate all sizes from a source image
convert source-icon.png -resize 72x72 icon-72x72.png
convert source-icon.png -resize 96x96 icon-96x96.png
convert source-icon.png -resize 128x128 icon-128x128.png
convert source-icon.png -resize 144x144 icon-144x144.png
convert source-icon.png -resize 152x152 icon-152x152.png
convert source-icon.png -resize 192x192 icon-192x192.png
convert source-icon.png -resize 384x384 icon-384x384.png
convert source-icon.png -resize 512x512 icon-512x512.png
```

### Option 3: Use Figma/Photoshop
1. Create a 512x512 canvas
2. Design your icon (keep important elements in the center 80%)
3. Export at different sizes listed above

## Design Guidelines

- **Simple and recognizable**: Icon should be clear at small sizes
- **No text**: Avoid text in icons (use symbols/logos)
- **Safe zone**: Keep important elements within center 80% (avoid edges)
- **Background**: Use solid color or simple gradient
- **Format**: PNG with transparency (if needed)
- **Colors**: Match your app's theme color (#6c63ff)

## Temporary Placeholder

Until you create proper icons, you can use a simple colored square:

1. Create a 512x512 PNG with your app's theme color
2. Add a music note emoji or simple logo
3. Resize to all required sizes

## Testing

After adding icons:
1. Clear browser cache
2. Reload the app
3. Check DevTools → Application → Manifest
4. Verify all icons load correctly
