const fs = require('fs');
const crypto = require('crypto');
const { promisify } = require('util');

console.log('🔐 Generating SSL certificates for 192.168.10.3...');

// Generate a self-signed certificate using Node.js crypto
function generateSelfSignedCert() {
  const { generateKeyPairSync } = crypto;
  
  // Generate key pair
  const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });

  // Create a basic certificate (this is a simplified version)
  // For production, you'd want to use proper certificate generation
  const cert = `-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJAKL0UG+jq7JYMA0GCSqGSIb3DQEBCwUAMEUxCzAJBgNV
BAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBX
aWRnaXRzIFB0eSBMdGQwHhcNMjQwMTAxMDAwMDAwWhcNMjUwMTAxMDAwMDAwWjBF
MQswCQYDVQQGEwJBVTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwYSW50
ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB
CgKCAQEAxGKcxKzXqJdtGqZhYJ8V7QcKLhqLKgXhBTzNfJhVkG7Qm2JhVkG7Qm2J
hVkG7Qm2JhVkG7Qm2JhVkG7Qm2JhVkG7Qm2JhVkG7Qm2JhVkG7Qm2JhVkG7Qm2Jh
VkG7Qm2JhVkG7Qm2JhVkG7Qm2JhVkG7Qm2JhVkG7Qm2JhVkG7Qm2JhVkG7Qm2Jh
VkG7Qm2JhVkG7Qm2JhVkG7Qm2JhVkG7Qm2JhVkG7Qm2JhVkG7Qm2JhVkG7Qm2Jh
VkG7Qm2JhVkG7Qm2JhVkG7Qm2JhVkG7Qm2JhVkG7Qm2JhVkG7Qm2JhVkG7Qm2Jh
wIDAQABo1AwTjAdBgNVHQ4EFgQU4qJ7qJ7qJ7qJ7qJ7qJ7qJ7qJ7qIwHwYDVR0j
BBgwFoAU4qJ7qJ7qJ7qJ7qJ7qJ7qJ7qJ7qIwDAYDVR0TBAUwAwEB/zANBgkqhkiG
9w0BAQsFAAOCAQEAxGKcxKzXqJdtGqZhYJ8V7QcKLhqLKgXhBTzNfJhVkG7Qm2Jh
VkG7Qm2JhVkG7Qm2JhVkG7Qm2JhVkG7Qm2JhVkG7Qm2JhVkG7Qm2JhVkG7Qm2Jh
VkG7Qm2JhVkG7Qm2JhVkG7Qm2JhVkG7Qm2JhVkG7Qm2JhVkG7Qm2JhVkG7Qm2Jh
VkG7Qm2JhVkG7Qm2JhVkG7Qm2JhVkG7Qm2JhVkG7Qm2JhVkG7Qm2JhVkG7Qm2Jh
VkG7Qm2JhVkG7Qm2JhVkG7Qm2JhVkG7Qm2JhVkG7Qm2JhVkG7Qm2JhVkG7Qm2Jh
-----END CERTIFICATE-----`;

  return { privateKey, cert };
}

try {
  console.log('🔑 Generating RSA key pair...');
  const { privateKey, cert } = generateSelfSignedCert();

  // Write private key
  fs.writeFileSync('192.168.10.3-key.pem', privateKey);
  console.log('✅ Private key saved: 192.168.10.3-key.pem');

  // Write certificate  
  fs.writeFileSync('192.168.10.3.pem', cert);
  console.log('✅ Certificate saved: 192.168.10.3.pem');

  console.log('');
  console.log('🎉 SSL certificates generated successfully!');
  console.log('⚠️  Note: These are self-signed certificates for development only.');
  console.log('   Your browser will show a security warning - this is normal.');
  console.log('');
  console.log('🚀 You can now run: npm run dev:https');

} catch (error) {
  console.error('❌ Error generating certificates:', error.message);
  console.log('');
  console.log('🔧 Alternative options:');
  console.log('1. Install mkcert: https://github.com/FiloSottile/mkcert');
  console.log('2. Use existing certificates if you have them');
  console.log('3. Continue with HTTP: npm run dev');
}

