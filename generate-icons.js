const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const iconSrc = path.join(__dirname, 'assets', 'icon.png');
const resDir = path.join(__dirname, 'android', 'app', 'src', 'main', 'res');

// Standard icon sizes
const iconSizes = [
    { dir: 'mipmap-mdpi', size: 48 },
    { dir: 'mipmap-hdpi', size: 72 },
    { dir: 'mipmap-xhdpi', size: 96 },
    { dir: 'mipmap-xxhdpi', size: 144 },
    { dir: 'mipmap-xxxhdpi', size: 192 },
];

// Adaptive icon foreground sizes
const foregroundSizes = [
    { dir: 'mipmap-mdpi', size: 108 },
    { dir: 'mipmap-hdpi', size: 162 },
    { dir: 'mipmap-xhdpi', size: 216 },
    { dir: 'mipmap-xxhdpi', size: 324 },
    { dir: 'mipmap-xxxhdpi', size: 432 },
];

async function generateIcons() {
    // Ensure directories exist
    for (const { dir } of iconSizes) {
        const dirPath = path.join(resDir, dir);
        fs.mkdirSync(dirPath, { recursive: true });
    }

    for (const { dir, size } of iconSizes) {
        const outPath = path.join(resDir, dir, 'ic_launcher.png');
        await sharp(iconSrc).resize(size, size).png().toFile(outPath);
        console.log(`ic_launcher.png -> ${dir} (${size}x${size})`);

        const roundPath = path.join(resDir, dir, 'ic_launcher_round.png');
        await sharp(iconSrc).resize(size, size).png().toFile(roundPath);
        console.log(`ic_launcher_round.png -> ${dir} (${size}x${size})`);
    }

    for (const { dir, size } of foregroundSizes) {
        const outPath = path.join(resDir, dir, 'ic_launcher_foreground.png');
        await sharp(iconSrc).resize(size, size).png().toFile(outPath);
        console.log(`ic_launcher_foreground.png -> ${dir} (${size}x${size})`);
    }

    console.log('\nAll icons generated successfully!');
}

generateIcons().catch(console.error);
