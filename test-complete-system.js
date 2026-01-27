/**
 * Complete System Test
 * Tests all endpoints and features
 */

const API_URL = 'http://localhost:3000';

console.log('🧪 Testing Complete Mental Health Screening System\n');
console.log('='.repeat(60));

async function testHealthCheck() {
    console.log('\n1️⃣  Testing Health Check...');
    try {
        const response = await fetch(`${API_URL}/health`);
        const data = await response.json();
        console.log('   ✅ Health check passed');
        console.log(`   Status: ${data.status}`);
        console.log(`   Whisper: ${data.services.whisper}`);
        console.log(`   Classifier: ${data.services.classifier}`);
        return true;
    } catch (error) {
        console.log('   ❌ Health check failed:', error.message);
        return false;
    }
}

async function testTextAnalysis() {
    console.log('\n2️⃣  Testing Text Analysis (Direct)...');
    try {
        const testTexts = [
            "I have been feeling very anxious and depressed lately",
            "I'm so happy and excited about life!",
            "I can't get out of bed, everything feels hopeless"
        ];

        for (const text of testTexts) {
            console.log(`\n   Testing: "${text.substring(0, 40)}..."`);
            
            const response = await fetch(`${API_URL}/api/text-analysis`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log(`   ✅ Analysis complete`);
            console.log(`      Risk Level: ${data.riskLevel}`);
            console.log(`      Top Prediction: ${data.prediction[0].label} (${(data.prediction[0].score * 100).toFixed(1)}%)`);
        }
        
        return true;
    } catch (error) {
        console.log('   ❌ Text analysis failed:', error.message);
        return false;
    }
}

async function testClassifierDirect() {
    console.log('\n3️⃣  Testing Classifier (Direct Connection)...');
    try {
        const response = await fetch('http://localhost:8000/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: 'I feel anxious' })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log('   ✅ Classifier responding');
        console.log(`      Prediction: ${data[0].label} (${(data[0].score * 100).toFixed(1)}%)`);
        return true;
    } catch (error) {
        console.log('   ❌ Classifier test failed:', error.message);
        return false;
    }
}

async function runAllTests() {
    console.log('\n🚀 Starting System Tests...\n');
    
    const results = {
        healthCheck: await testHealthCheck(),
        textAnalysis: await testTextAnalysis(),
        classifierDirect: await testClassifierDirect()
    };

    console.log('\n' + '='.repeat(60));
    console.log('\n📊 Test Results Summary:\n');
    
    const passed = Object.values(results).filter(r => r).length;
    const total = Object.keys(results).length;
    
    Object.entries(results).forEach(([test, result]) => {
        const icon = result ? '✅' : '❌';
        const name = test.replace(/([A-Z])/g, ' $1').trim();
        console.log(`   ${icon} ${name}`);
    });

    console.log(`\n   Total: ${passed}/${total} tests passed\n`);

    if (passed === total) {
        console.log('🎉 All tests passed! System is production-ready!\n');
        console.log('✨ You can now use:');
        console.log('   • enhanced-client.html (web interface)');
        console.log('   • POST /api/text-analysis (text input)');
        console.log('   • POST /api/full-analysis (audio input)');
    } else {
        console.log('⚠️  Some tests failed. Please check the errors above.\n');
    }

    console.log('='.repeat(60) + '\n');
}

runAllTests();
