/**
 * Setup Verification Script
 * Checks if all components are properly configured
 */

import fs from 'fs';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const checks = [];

console.log('🔍 Verifying Mental Health Screening API Setup\n');
console.log('='.repeat(50));

// Check 1: Node.js version
console.log('\n1️⃣  Checking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion >= 18) {
  console.log(`   ✅ Node.js ${nodeVersion} (OK)`);
  checks.push({ name: 'Node.js', status: 'pass' });
} else {
  console.log(`   ❌ Node.js ${nodeVersion} (Need v18 or higher)`);
  checks.push({ name: 'Node.js', status: 'fail' });
}

// Check 2: Dependencies
console.log('\n2️⃣  Checking dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = [
    '@huggingface/inference',
    'express',
    'multer',
    'axios',
    'dotenv',
    'cors'
  ];
  
  const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);
  
  if (missingDeps.length === 0) {
    console.log('   ✅ All dependencies listed in package.json');
    
    // Check if node_modules exists
    if (fs.existsSync('node_modules')) {
      console.log('   ✅ node_modules folder exists');
      checks.push({ name: 'Dependencies', status: 'pass' });
    } else {
      console.log('   ⚠️  node_modules not found. Run: npm install');
      checks.push({ name: 'Dependencies', status: 'warn' });
    }
  } else {
    console.log(`   ❌ Missing dependencies: ${missingDeps.join(', ')}`);
    checks.push({ name: 'Dependencies', status: 'fail' });
  }
} catch (error) {
  console.log('   ❌ Error reading package.json');
  checks.push({ name: 'Dependencies', status: 'fail' });
}

// Check 3: .env file
console.log('\n3️⃣  Checking environment configuration...');
if (fs.existsSync('.env')) {
  console.log('   ✅ .env file exists');
  
  const hfToken = process.env.HF_TOKEN;
  if (hfToken && hfToken !== 'your_huggingface_token_here' && hfToken.startsWith('hf_')) {
    console.log('   ✅ HF_TOKEN is configured');
    checks.push({ name: 'Environment', status: 'pass' });
  } else {
    console.log('   ❌ HF_TOKEN not configured or invalid');
    console.log('      Get your token at: https://huggingface.co/settings/tokens');
    checks.push({ name: 'Environment', status: 'fail' });
  }
} else {
  console.log('   ❌ .env file not found');
  console.log('      Run: cp .env.example .env');
  checks.push({ name: 'Environment', status: 'fail' });
}

// Check 4: Project structure
console.log('\n4️⃣  Checking project structure...');
const requiredFiles = [
  'server.js',
  'routes/analysis.js',
  'services/whisperService.js',
  'services/classifierService.js',
  'utils/riskAnalysis.js',
  'middleware/errorHandler.js'
];

const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));

if (missingFiles.length === 0) {
  console.log('   ✅ All required files present');
  checks.push({ name: 'Project Structure', status: 'pass' });
} else {
  console.log(`   ❌ Missing files: ${missingFiles.join(', ')}`);
  checks.push({ name: 'Project Structure', status: 'fail' });
}

// Check 5: Local classifier
console.log('\n5️⃣  Checking local classifier connection...');
const classifierUrl = process.env.CLASSIFIER_URL || 'http://localhost:8000/predict';

try {
  const response = await axios.get(classifierUrl.replace('/predict', '/health'), {
    timeout: 3000
  });
  console.log('   ✅ Local classifier is running');
  checks.push({ name: 'Local Classifier', status: 'pass' });
} catch (error) {
  if (error.code === 'ECONNREFUSED') {
    console.log('   ⚠️  Local classifier not running');
    console.log('      Start it with: uvicorn main:app --reload --port 8000');
    checks.push({ name: 'Local Classifier', status: 'warn' });
  } else if (error.response?.status === 404) {
    console.log('   ⚠️  Classifier running but /health endpoint not found (OK)');
    checks.push({ name: 'Local Classifier', status: 'pass' });
  } else {
    console.log(`   ⚠️  Could not verify classifier: ${error.message}`);
    checks.push({ name: 'Local Classifier', status: 'warn' });
  }
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('\n📊 Setup Summary:\n');

const passed = checks.filter(c => c.status === 'pass').length;
const warned = checks.filter(c => c.status === 'warn').length;
const failed = checks.filter(c => c.status === 'fail').length;

checks.forEach(check => {
  const icon = check.status === 'pass' ? '✅' : check.status === 'warn' ? '⚠️' : '❌';
  console.log(`   ${icon} ${check.name}`);
});

console.log(`\n   Total: ${passed} passed, ${warned} warnings, ${failed} failed\n`);

if (failed === 0 && warned === 0) {
  console.log('🎉 All checks passed! You\'re ready to start the server.');
  console.log('\n   Run: npm start\n');
} else if (failed === 0) {
  console.log('⚠️  Setup mostly complete with some warnings.');
  console.log('   You can start the server, but some features may not work.\n');
  console.log('   Run: npm start\n');
} else {
  console.log('❌ Setup incomplete. Please fix the failed checks above.\n');
  console.log('   See SETUP.md for detailed instructions.\n');
}

console.log('='.repeat(50));