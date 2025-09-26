const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '192.168.10.3';
const port = process.env.PORT || 3000;

// Initialize Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Check if certificate files exist
  const certPath = path.join(__dirname, '192.168.10.3.pem');
  const keyPath = path.join(__dirname, '192.168.10.3-key.pem');
  
  if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
    console.error('❌ SSL certificate files not found!');
    console.error(`Expected certificate at: ${certPath}`);
    console.error(`Expected key at: ${keyPath}`);
    console.error('');
    console.error('🔧 To generate SSL certificates:');
    console.error('   PowerShell: .\\generate-ssl.ps1');
    console.error('   Or run: node setup-https.js');
    console.error('');
    console.error('💡 For now, you can use: npm run dev (HTTP)');
    process.exit(1);
  }

  // HTTPS options
  const httpsOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };

  // Create HTTPS server
  createServer(httpsOptions, async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
    .once('error', (err) => {
      console.error('HTTPS Server error:', err);
      process.exit(1);
    })
    .listen(port, hostname, () => {
      console.log(`🔒 HTTPS Server ready on https://${hostname}:${port}`);
      console.log(`📱 Local network access: https://${hostname}:${port}`);
    });
});
