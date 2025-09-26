const fs = require('fs');
const path = require('path');

console.log('🔍 HTTPS Setup Helper');
console.log('=====================');

// Check for certificate files in common locations
const possibleLocations = [
  './192.168.10.3.pem',
  './192.168.10.3-key.pem',
  '../192.168.10.3.pem',
  '../192.168.10.3-key.pem',
  '~/192.168.10.3.pem',
  '~/192.168.10.3-key.pem',
];

console.log('\nChecking for SSL certificate files...');

const certPath = path.join(__dirname, '192.168.10.3.pem');
const keyPath = path.join(__dirname, '192.168.10.3-key.pem');

let foundCert = false;
let foundKey = false;

// Check if files exist in project root
if (fs.existsSync(certPath)) {
  console.log('✅ Certificate found:', certPath);
  foundCert = true;
} else {
  console.log('❌ Certificate not found:', certPath);
}

if (fs.existsSync(keyPath)) {
  console.log('✅ Private key found:', keyPath);
  foundKey = true;
} else {
  console.log('❌ Private key not found:', keyPath);
}

if (foundCert && foundKey) {
  console.log('\n🎉 SSL certificates are properly configured!');
  console.log('You can now run: npm run dev:https');
} else {
  console.log('\n📋 To set up HTTPS, please:');
  console.log('1. Copy your SSL certificate files to the project root:');
  console.log('   - 192.168.10.3.pem (certificate)');
  console.log('   - 192.168.10.3-key.pem (private key)');
  console.log('\n2. Then run: npm run dev:https');
  console.log('\n💡 If you need to generate SSL certificates, you can use:');
  console.log('   - mkcert (recommended): https://github.com/FiloSottile/mkcert');
  console.log('   - OpenSSL for custom certificates');
}

console.log('\n🌐 Available commands:');
console.log('   npm run dev        - HTTP development server');
console.log('   npm run dev:https  - HTTPS development server');
console.log('   npm run start:https - HTTPS production server');

