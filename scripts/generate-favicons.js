const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

async function generateIcons() {
  const svg = fs.readFileSync(path.join(__dirname, "../public/favicon.svg"));

  // Generate apple-touch-icon.png (180x180)
  await sharp(svg)
    .resize(180, 180)
    .png()
    .toFile(path.join(__dirname, "../public/apple-touch-icon.png"));

  // Generate favicon.ico as PNG (most modern browsers support PNG format)
  await sharp(svg)
    .resize(32, 32)
    .png()
    .toFile(path.join(__dirname, "../public/favicon.ico"));
}

generateIcons().catch(console.error);
