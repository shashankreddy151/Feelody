#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Pre-build checks...');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'src/index.js',
  'src/App.js',
  'public/index.html'
];

const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
if (missingFiles.length > 0) {
  console.error('❌ Missing required files:', missingFiles);
  process.exit(1);
}

console.log('✅ All required files present');

// Check for environment variables
const envVars = process.env;
if (!envVars.REACT_APP_LASTFM_API_KEY) {
  console.warn('⚠️  Warning: REACT_APP_LASTFM_API_KEY not set. Some features may be limited.');
}

console.log('🏗️  Starting build...');

try {
  // Set CI to false to treat warnings as warnings, not errors
  const isWindows = process.platform === 'win32';
  const buildCommand = isWindows ? 'set CI=false && npx react-app-rewired build' : 'CI=false npx react-app-rewired build';
  
  // Run the build
  execSync(buildCommand, { 
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, CI: 'false' }
  });
  
  console.log('✅ Build completed successfully!');
  
  // Check if build directory exists and has content
  const buildDir = path.join(__dirname, 'build');
  if (fs.existsSync(buildDir)) {
    const files = fs.readdirSync(buildDir);
    console.log(`📦 Build directory contains ${files.length} files/folders`);
    
    // Check for essential files
    const essentialFiles = ['index.html', 'static'];
    const missingEssential = essentialFiles.filter(file => !fs.existsSync(path.join(buildDir, file)));
    
    if (missingEssential.length > 0) {
      console.error('❌ Missing essential build files:', missingEssential);
      process.exit(1);
    }
    
    console.log('✅ Build verification passed!');
  } else {
    console.error('❌ Build directory not created');
    process.exit(1);
  }
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
