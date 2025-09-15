const fs = require('fs');
const path = require('path');

// Test template replacement
const templatePath = path.join(__dirname, 'dist', 'src', 'modules', 'mailer', 'templates', 'guest-qr-code.html');
let html = fs.readFileSync(templatePath, 'utf-8');

console.log('Before replacement:');
console.log('Template contains __GUEST_NAME__:', html.includes('__GUEST_NAME__'));
console.log('Template contains __ALPHANUMERIC_CODE__:', html.includes('__ALPHANUMERIC_CODE__'));

html = html.replace(/__GUEST_NAME__/g, 'Test User');
html = html.replace(/__ALPHANUMERIC_CODE__/g, 'TEST123');

console.log('After replacement:');
console.log('Template contains __GUEST_NAME__:', html.includes('__GUEST_NAME__'));
console.log('Template contains __ALPHANUMERIC_CODE__:', html.includes('__ALPHANUMERIC_CODE__'));

// Check if the replacements actually worked
console.log('Contains Test User:', html.includes('Test User'));
console.log('Contains TEST123:', html.includes('TEST123'));
