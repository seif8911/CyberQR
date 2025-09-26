# PowerShell script to generate SSL certificates for local development
Write-Host "🔐 SSL Certificate Generator for 192.168.10.3" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

$certName = "192.168.10.3"
$certFile = "$certName.pem"
$keyFile = "$certName-key.pem"

# Check if OpenSSL is available
$opensslPath = Get-Command openssl -ErrorAction SilentlyContinue

if ($opensslPath) {
    Write-Host "✅ OpenSSL found at: $($opensslPath.Source)" -ForegroundColor Green
    
    # Generate private key
    Write-Host "🔑 Generating private key..." -ForegroundColor Yellow
    & openssl genrsa -out $keyFile 2048
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Private key generated: $keyFile" -ForegroundColor Green
        
        # Generate certificate
        Write-Host "📜 Generating certificate..." -ForegroundColor Yellow
        & openssl req -new -x509 -key $keyFile -out $certFile -days 365 -subj "/CN=$certName/O=Local Development/C=US"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Certificate generated: $certFile" -ForegroundColor Green
            Write-Host ""
            Write-Host "🎉 SSL certificates created successfully!" -ForegroundColor Green
            Write-Host "You can now run: npm run dev:https" -ForegroundColor Cyan
        } else {
            Write-Host "❌ Failed to generate certificate" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Failed to generate private key" -ForegroundColor Red
    }
} else {
    Write-Host "❌ OpenSSL not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "📋 To install OpenSSL on Windows:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://slproweb.com/products/Win32OpenSSL.html" -ForegroundColor White
    Write-Host "2. Or install via Chocolatey: choco install openssl" -ForegroundColor White
    Write-Host "3. Or install via Scoop: scoop install openssl" -ForegroundColor White
    Write-Host ""
    Write-Host "🔧 Alternative: Use mkcert (recommended)" -ForegroundColor Yellow
    Write-Host "1. Download from: https://github.com/FiloSottile/mkcert/releases" -ForegroundColor White
    Write-Host "2. Run: mkcert -install" -ForegroundColor White
    Write-Host "3. Run: mkcert 192.168.10.3" -ForegroundColor White
    Write-Host ""
    Write-Host "📝 Or create certificates manually and place them as:" -ForegroundColor Yellow
    Write-Host "   - 192.168.10.3.pem (certificate)" -ForegroundColor White
    Write-Host "   - 192.168.10.3-key.pem (private key)" -ForegroundColor White
}

Write-Host ""
Write-Host "🌐 Available commands after setup:" -ForegroundColor Cyan
Write-Host "   npm run dev:https  - HTTPS development server" -ForegroundColor White
Write-Host "   npm run start:https - HTTPS production server" -ForegroundColor White
