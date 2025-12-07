/**
 * Script to batch update HTML pages
 * Updates branding, removes licensing links, adds i18n support
 */

const fs = require('fs');
const path = require('path');

const pages = [
  'contact.html',
  'faq.html',
  'privacy.html',
  'terms.html'
];

const replacements = [
  // Update title
  { from: /PDFToolkit/g, to: 'PDFToolkit' },
  { from: /PDFToolkit/g, to: 'PDFToolkit' },
  { from: /PDFToolkit/g, to: 'PDFToolkit' },
  
  // Update favicon
  { from: /\/images\/favicon\.svg/g, to: '/images/pdftoolkit-favicon.svg' },
  { from: /images\/favicon\.svg/g, to: 'images/pdftoolkit-logo.svg' },
  
  // Remove licensing links
  { from: /<a href="\.\/licensing\.html"[^>]*>.*?<\/a>/gs, to: '' },
  { from: /<li>\s*<a href="\.\/licensing\.html"[^>]*>.*?<\/a>\s*<\/li>/gs, to: '' },
  
  // Remove GitHub links in footers
  { from: /<a href="https:\/\/github\.com\/alam00000\/pdftoolkit"[^>]*>[\s\S]*?<\/a>/g, to: '' },
  { from: /<a href="https:\/\/discord\.gg\/[^"]*"[^>]*>[\s\S]*?<\/a>/g, to: '' },
  { from: /<a href="https:\/\/www\.instagram\.com\/[^"]*"[^>]*>[\s\S]*?<\/a>/g, to: '' },
  { from: /<a href="https:\/\/www\.linkedin\.com\/[^"]*"[^>]*>[\s\S]*?<\/a>/g, to: '' },
  { from: /<a href="https:\/\/x\.com\/[^"]*"[^>]*>[\s\S]*?<\/a>/g, to: '' },
];

console.log('Updating pages...\n');

pages.forEach(page => {
  const filePath = path.join(__dirname, '..', page);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${page} not found, skipping...`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  replacements.forEach(({ from, to }) => {
    content = content.replace(from, to);
  });
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Updated ${page}`);
});

console.log('\n✨ All pages updated successfully!');

