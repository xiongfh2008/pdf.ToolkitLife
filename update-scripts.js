const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const rootDir = __dirname;

function updateHtmlFile(filePath, isRoot) {
  let content = fs.readFileSync(filePath, 'utf8');
  const relativePath = isRoot ? '.' : '../..';
  const jsPath = isRoot ? './src/js' : '../js';

  // 1. Add SEO Meta Tags if missing
  if (!content.includes('<meta name="description"')) {
    const metaTags = `
  <meta name="description" content="PDFToolkit is a powerful, privacy-first PDF toolkit." />
  <meta name="keywords" content="pdf tools, privacy, merge pdf, split pdf, edit pdf" />`;
    content = content.replace('<title>', `${metaTags}\n  <title>`);
  }

  // 2. Add Language Switcher to Desktop Nav
  // Look for the "All Tools" link and append the switcher after it
  if (!content.includes('id="language-switcher-desktop"')) {
    const desktopNavPattern = /(<a href="[^"]*index\.html#tools-header"[^>]*>All Tools<\/a>)\s*(<\/div>)/;
    content = content.replace(desktopNavPattern, '$1\n          <!-- Language Switcher -->\n          <div id="language-switcher-desktop"></div>\n        $2');
  }

  // 3. Add Language Switcher to Mobile Nav
  if (!content.includes('id="language-switcher-mobile"')) {
    const mobileNavPattern = /(<!-- Mobile Hamburger Button -->\s*<div class="md:hidden flex items-center">)/;
    // Note: The previous regex might fail if the class has changed. Let's try to find the container.
    // In contact.html it was: <div class="md:hidden flex items-center gap-2">
    // In subpages it might be: <div class="md:hidden flex items-center">
    
    if (content.includes('<div class="md:hidden flex items-center gap-2">')) {
       // Already updated likely
    } else {
       content = content.replace(
        '<!-- Mobile Hamburger Button -->\n        <div class="md:hidden flex items-center">',
        '<!-- Mobile Hamburger Button -->\n        <div class="md:hidden flex items-center gap-2">\n          <!-- Language Switcher Mobile -->\n          <div id="language-switcher-mobile"></div>'
       );
    }
  }

  // 4. Inject Scripts
  // We need to add i18n and LanguageSwitcher scripts
  // For root pages: src/js/i18n/index.ts and src/js/components/LanguageSwitcher.ts
  // For sub pages: ../js/i18n/index.ts and ../js/components/LanguageSwitcher.ts (compiled to .js in dev, but .ts source)
  
  // Actually, in vite dev we import .ts. In build we import .js? 
  // The existing index.html uses .ts for src/js/main.ts. 
  
  const scriptImport = `
  <script type="module" src="${jsPath}/i18n/index.ts"></script>
  <script type="module">
    import { LanguageSwitcher } from '${jsPath}/components/LanguageSwitcher.ts';
    
    document.addEventListener('DOMContentLoaded', () => {
      new LanguageSwitcher('language-switcher-desktop');
      new LanguageSwitcher('language-switcher-mobile');
    });
  </script>`;

  if (!content.includes('LanguageSwitcher.ts')) {
    content = content.replace('</body>', `${scriptImport}\n</body>`);
  }

  // 5. Update Page Title with data-i18n
  if (!content.includes('data-i18n-title')) {
      // This is tricky to automate perfectly for every page, but we can add a default
      // or leave it for manual refinement.
      // Let's at least ensure the brand name is correct.
      content = content.replace(' - PDFToolkit', ' - PDFToolkit');
      content = content.replace('PDFToolkit - ', 'PDFToolkit - ');
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}

// Update Root Pages
['about.html', 'contact.html', 'faq.html', 'privacy.html', 'terms.html'].forEach(file => {
    const p = path.join(rootDir, file);
    if (fs.existsSync(p)) updateHtmlFile(p, true);
});

// Update Sub Pages
if (fs.existsSync(pagesDir)) {
    const files = fs.readdirSync(pagesDir);
    files.forEach(file => {
        if (file.endsWith('.html')) {
            updateHtmlFile(path.join(pagesDir, file), false);
        }
    });
}

