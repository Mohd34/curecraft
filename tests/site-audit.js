// CureCraft Comprehensive Technical SEO & Structural Audit Script
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
console.log('=== RUNNING CURECRAFT SITE & TECHNICAL SEO AUDIT ===\n');

let passCount = 0;
let failCount = 0;

function assertCheck(desc, condition) {
  if (condition) {
    console.log(`✓ PASS: ${desc}`);
    passCount++;
  } else {
    console.error(`✗ FAIL: ${desc}`);
    failCount++;
  }
}

// 1. Verify Sitemap matches actual HTML files
const sitemapPath = path.join(rootDir, 'sitemap.xml');
assertCheck('sitemap.xml exists', fs.existsSync(sitemapPath));

const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
const locMatches = [...sitemapContent.matchAll(/<loc>https:\/\/mohd34\.github\.io\/curecraft\/?(.*?)<\/loc>/g)];
console.log(`\nFound ${locMatches.length} URLs in sitemap.xml:`);

locMatches.forEach(m => {
  let relativePath = m[1];
  if (relativePath === '') relativePath = 'index.html';
  const filePath = path.join(rootDir, relativePath);
  assertCheck(`Sitemap URL resolves to local file: ${relativePath}`, fs.existsSync(filePath));
});

// 2. Audit Core HTML Files for Technical SEO & Accessibility
const htmlFiles = [
  'index.html',
  'wet-brine-calculator.html',
  'charcuterie-drying-calculator.html',
  'curing-time-calculator.html',
  'nitrite-converter.html',
  'biltong-calculator.html',
  'seo-dashboard.html',
  'guides/equilibrium-curing-guide.html',
  'guides/prague-powder-guide.html',
  'guides/charcuterie-weight-loss-guide.html'
];

console.log('\nAuditing HTML Pages for Title, Meta Description, Canonical, H1, Schema, Viewport:');

htmlFiles.forEach(file => {
  const fullPath = path.join(rootDir, file);
  if (!fs.existsSync(fullPath)) {
    assertCheck(`File exists: ${file}`, false);
    return;
  }

  const content = fs.readFileSync(fullPath, 'utf8');

  // Title tag
  assertCheck(`[${file}] Has <title>`, /<title>.+<\/title>/i.test(content));

  // Meta description
  assertCheck(`[${file}] Has <meta name="description"`, /<meta\s+name=["']description["']/i.test(content));

  // Canonical tag
  assertCheck(`[${file}] Has <link rel="canonical"`, /<link\s+rel=["']canonical["']/i.test(content));

  // Viewport
  assertCheck(`[${file}] Has responsive <meta name="viewport"`, /<meta\s+name=["']viewport["']/i.test(content));

  // H1 tag
  assertCheck(`[${file}] Has <h1> heading`, /<h1[^>]*>.+<\/h1>/is.test(content));

  // JSON-LD structured data
  assertCheck(`[${file}] Has JSON-LD structured data`, /<script\s+type=["']application\/ld\+json["']/i.test(content));
});

// 3. Technical SEO Assets
console.log('\nAuditing Auxiliary Assets & PWA Configurations:');
assertCheck('robots.txt exists', fs.existsSync(path.join(rootDir, 'robots.txt')));
if (fs.existsSync(path.join(rootDir, 'robots.txt'))) {
  const robots = fs.readFileSync(path.join(rootDir, 'robots.txt'), 'utf8');
  assertCheck('robots.txt references sitemap.xml', robots.includes('sitemap.xml'));
}

assertCheck('site.webmanifest exists', fs.existsSync(path.join(rootDir, 'site.webmanifest')));
assertCheck('favicon.svg exists', fs.existsSync(path.join(rootDir, 'assets', 'img', 'favicon.svg')));
assertCheck('style.css exists', fs.existsSync(path.join(rootDir, 'assets', 'css', 'style.css')));
assertCheck('calculators.js exists', fs.existsSync(path.join(rootDir, 'assets', 'js', 'calculators.js')));
assertCheck('app.js exists', fs.existsSync(path.join(rootDir, 'assets', 'js', 'app.js')));
assertCheck('keywords.json exists', fs.existsSync(path.join(rootDir, 'data', 'keywords.json')));

console.log('\n======================================================');
if (failCount === 0) {
  console.log(`AUDIT COMPLETE: ${passCount} PASSED, 0 FAILED`);
  console.log('======================================================\n');
  process.exit(0);
} else {
  console.error(`AUDIT FAILED: ${failCount} checks failed.`);
  console.log('======================================================\n');
  process.exit(1);
}
