# 🔧 Node.js Version Fix for Netlify EBADENGINE Error

## Problem
```
The build failure is caused by the Node.js version mismatch for the package '@solana/codecs-core'. 
The package requires Node.js version '>=20.18.0', but the current Node.js version being used is 'v18.20.8'. 
This is producing the 'EBADENGINE' error.
```

## Root Cause
The `web3` package (version 4.16.0) in your dependencies pulls in Solana-related packages that require Node.js 20.18.0+, but Netlify was defaulting to Node.js 18.

## ✅ Solution Applied

### 1. Updated netlify.toml
```toml
[build.environment]
  NODE_VERSION = "20.18.0"
  NPM_VERSION = "10"
```

### 2. Added .nvmrc for local development
```
20.18.0
```

### 3. Updated package.json engines
```json
"engines": {
  "node": ">=20.18.0",
  "npm": ">=10.0.0"
}
```

### 4. Enhanced build validation
The `build-check.js` script now validates Node.js version and warns if incompatible.

## Verification
Run locally:
```bash
npm run build:check
```

This will show warnings if your local Node.js version doesn't meet requirements.

## Deploy
Your Netlify build should now succeed with Node.js 20.18.0! 🚀
