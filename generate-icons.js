/**
 * Script para gerar ícones PWA
 * Execute: node generate-icons.js
 * 
 * Este script cria ícones PNG simples para o PWA.
 * Para ícones de melhor qualidade, você pode usar ferramentas online como:
 * - https://www.pwabuilder.com/imageGenerator
 * - https://realfavicongenerator.net/
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create a simple SVG icon
const createSvgIcon = (size) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="100%" style="stop-color:#16213e"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f5af19"/>
      <stop offset="100%" style="stop-color:#f12711"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#bg)"/>
  <rect x="${size * 0.45}" y="${size * 0.2}" width="${size * 0.1}" height="${size * 0.6}" rx="${size * 0.02}" fill="url(#gold)"/>
  <rect x="${size * 0.3}" y="${size * 0.34}" width="${size * 0.4}" height="${size * 0.1}" rx="${size * 0.02}" fill="url(#gold)"/>
</svg>`;

const iconsDir = join(__dirname, 'public', 'icons');

// Ensure icons directory exists
if (!existsSync(iconsDir)) {
    mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icons for each size
// Note: For production, you'd want to convert these to PNG using a tool like sharp
sizes.forEach(size => {
    const svg = createSvgIcon(size);
    const filename = `icon-${size}x${size}.svg`;
    writeFileSync(join(iconsDir, filename), svg);
    console.log(`Created ${filename}`);
});

console.log('\n✅ Icons created successfully!');
console.log('\n📝 Note: For PNG icons, you can use online tools like:');
console.log('   - https://www.pwabuilder.com/imageGenerator');
console.log('   - Upload the icon.svg file to generate all sizes');
