const fs = require('fs');
const path = require('path');

const replacements = [
  // Brand names
  { from: /BentoPDF/g, to: 'PDFToolkit' },
  { from: /Bento PDF/g, to: 'PDFToolkit' },
  { from: /bentopdf/g, to: 'pdftoolkit' },
  
  // Image references
  { from: /images\/favicon\.svg/g, to: 'images/pdftoolkit-logo.svg' },
  { from: /alt="Bento PDF Logo"/g, to: 'alt="PDFToolkit Logo"' },
  
  // Social media links (remove or replace)
  { from: /https:\/\/github\.com\/alam00000\/bentopdf/g, to: '#' },
  { from: /https:\/\/www\.instagram\.com\/thebentopdf\//g, to: '#' },
  { from: /https:\/\/www\.linkedin\.com\/company\/bentopdf\//g, to: '#' },
  { from: /https:\/\/x\.com\/BentoPDF/g, to: '#' },
  { from: /https:\/\/discord\.gg\/AP2Y97juZT/g, to: '#' },
];

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  replacements.forEach(({ from, to }) => {
    if (content.match(from)) {
      content = content.replace(from, to);
      modified = true;
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated: ${filePath}`);
    return true;
  }
  return false;
}

function processDirectory(dir, extensions = ['.html', '.ts', '.js', '.md']) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let totalUpdated = 0;
  
  files.forEach(file => {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory() && !['node_modules', 'dist', '.git'].includes(file.name)) {
      totalUpdated += processDirectory(fullPath, extensions);
    } else if (file.isFile()) {
      const ext = path.extname(file.name);
      if (extensions.includes(ext)) {
        if (replaceInFile(fullPath)) {
          totalUpdated++;
        }
      }
    }
  });
  
  return totalUpdated;
}

console.log('🔄 Starting cleanup of BentoPDF references...\n');
const updated = processDirectory(__dirname);
console.log(`\n✅ Cleanup complete! Updated ${updated} files.`);

