#!/usr/bin/env node
/**
 * Pre-deployment check script
 * Validates that the project is ready for deployment to Cloudflare Pages
 */

import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🔍 Running pre-deployment checks...\n');

let passed = 0;
let failed = 0;

function check(name, condition, successMsg, failMsg) {
  if (condition) {
    console.log(`✅ ${name}: ${successMsg}`);
    passed++;
    return true;
  } else {
    console.log(`❌ ${name}: ${failMsg}`);
    failed++;
    return false;
  }
}

// Check 1: dist directory exists
const distExists = existsSync(join(rootDir, 'dist'));
check(
  'Build Output',
  distExists,
  'dist/ directory found',
  'dist/ directory not found. Run "npm run build" first.'
);

// Check 2: index.html exists in dist
const indexExists = existsSync(join(rootDir, 'dist', 'index.html'));
check(
  'Index File',
  indexExists,
  'index.html found in dist/',
  'index.html not found in dist/. Build may have failed.'
);

// Check 3: package.json exists and is valid
let packageJson = null;
try {
  const packagePath = join(rootDir, 'package.json');
  packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
  check(
    'Package Configuration',
    packageJson && packageJson.name === 'pdftoolkit',
    `Project name: ${packageJson.name} v${packageJson.version}`,
    'package.json is invalid or missing'
  );
} catch (error) {
  check('Package Configuration', false, '', `Error reading package.json: ${error.message}`);
}

// Check 4: Cloudflare configuration files
const wranklerExists = existsSync(join(rootDir, 'wrangler.toml'));
check(
  'Cloudflare Config',
  wranklerExists,
  'wrangler.toml found',
  'wrangler.toml not found (optional)'
);

// Check 5: Headers file
const headersExists = existsSync(join(rootDir, 'public', '_headers'));
check(
  'Headers Configuration',
  headersExists,
  '_headers file found',
  '_headers file not found (optional)'
);

// Check 6: Redirects file
const redirectsExists = existsSync(join(rootDir, 'public', '_redirects'));
check(
  'Redirects Configuration',
  redirectsExists,
  '_redirects file found',
  '_redirects file not found (optional)'
);

// Check 7: Node version files
const nvmrcExists = existsSync(join(rootDir, '.nvmrc'));
const nodeVersionExists = existsSync(join(rootDir, '.node-version'));
check(
  'Node.js Version',
  nvmrcExists || nodeVersionExists,
  'Version file found (.nvmrc or .node-version)',
  'No Node.js version file found (optional)'
);

// Check 8: Critical assets
const assetsDir = join(rootDir, 'dist', 'assets');
const assetsExist = existsSync(assetsDir);
check(
  'Assets',
  assetsExist,
  'Assets directory found',
  'Assets directory not found in dist/'
);

// Check 9: i18n files
if (distExists && indexExists) {
  const indexContent = readFileSync(join(rootDir, 'dist', 'index.html'), 'utf8');
  const hasI18n = indexContent.includes('data-i18n');
  check(
    'Internationalization',
    hasI18n,
    'i18n attributes detected',
    'i18n attributes not found in index.html'
  );

  // Check 10: Brand name updated
  const hasPDFToolkit = indexContent.includes('PDFToolkit');
  const hasBentoPDF = indexContent.includes('BentoPDF');
  check(
    'Branding',
    hasPDFToolkit && !hasBentoPDF,
    'PDFToolkit branding detected',
    'BentoPDF branding still present or PDFToolkit not found'
  );
}

// Summary
console.log('\n' + '='.repeat(50));
console.log(`\n📊 Summary: ${passed} passed, ${failed} failed\n`);

if (failed === 0) {
  console.log('🎉 All checks passed! Your project is ready for deployment.\n');
  console.log('Next steps:');
  console.log('  1. Push to Git: git push origin main');
  console.log('  2. Deploy to Cloudflare Pages:');
  console.log('     - Via dashboard: https://dash.cloudflare.com/');
  console.log('     - Via CLI: npm run deploy:preview\n');
  console.log('See CLOUDFLARE_DEPLOYMENT.md for detailed instructions.\n');
  process.exit(0);
} else {
  console.log('⚠️  Some checks failed. Please review the errors above.\n');
  console.log('Common fixes:');
  console.log('  - Run "npm run build" to generate dist/ folder');
  console.log('  - Check that all files are committed to Git');
  console.log('  - Review the build logs for errors\n');
  process.exit(1);
}

