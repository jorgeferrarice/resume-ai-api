"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testApiEndpoints = void 0;
const testApiEndpoints = async (baseUrl = 'http://localhost:3000') => {
    console.log('🧪 Testing API endpoints...');
    try {
        console.log('\n📋 Testing health endpoint...');
        const healthResponse = await fetch(`${baseUrl}/health`);
        const healthData = await healthResponse.json();
        console.log('✅ Health:', healthData.success ? 'OK' : 'FAILED');
        console.log('\n📚 Testing API info endpoint...');
        const apiResponse = await fetch(`${baseUrl}/api`);
        const apiData = await apiResponse.json();
        console.log('✅ API Info:', apiData.success ? 'OK' : 'FAILED');
        console.log('\n📄 Testing get all resumes...');
        const resumesResponse = await fetch(`${baseUrl}/api/resume`);
        const resumesData = await resumesResponse.json();
        console.log('✅ Get Resumes:', resumesData.success ? 'OK' : 'FAILED');
        console.log(`   Found ${resumesData.data?.length || 0} resumes`);
        console.log('\n➕ Testing create resume...');
        const newResumeData = {
            name: 'Test User',
            email: 'test@example.com',
            title: 'TypeScript Developer',
            skills: ['TypeScript', 'Express.js', 'Node.js']
        };
        const createResponse = await fetch(`${baseUrl}/api/resume`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newResumeData)
        });
        const createData = await createResponse.json();
        console.log('✅ Create Resume:', createData.success ? 'OK' : 'FAILED');
        if (createData.success && createData.data) {
            console.log('\n🔍 Testing get resume by ID...');
            const getResponse = await fetch(`${baseUrl}/api/resume/${createData.data.id}`);
            const getData = await getResponse.json();
            console.log('✅ Get Resume by ID:', getData.success ? 'OK' : 'FAILED');
            console.log('\n✏️  Testing update resume...');
            const updateResponse = await fetch(`${baseUrl}/api/resume/${createData.data.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: 'Senior TypeScript Developer'
                })
            });
            const updateData = await updateResponse.json();
            console.log('✅ Update Resume:', updateData.success ? 'OK' : 'FAILED');
            console.log('\n🤖 Testing AI analysis...');
            const analysisResponse = await fetch(`${baseUrl}/api/resume/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    resumeContent: 'TypeScript developer with Express.js experience'
                })
            });
            const analysisData = await analysisResponse.json();
            console.log('✅ AI Analysis:', analysisData.success ? 'OK' : 'FAILED');
            console.log('\n🗑️  Cleaning up test resume...');
            const deleteResponse = await fetch(`${baseUrl}/api/resume/${createData.data.id}`, {
                method: 'DELETE'
            });
            const deleteData = await deleteResponse.json();
            console.log('✅ Delete Resume:', deleteData.success ? 'OK' : 'FAILED');
        }
        console.log('\n🎉 All tests completed!');
    }
    catch (error) {
        console.error('❌ Test failed:', error);
    }
};
exports.testApiEndpoints = testApiEndpoints;
exports.default = exports.testApiEndpoints;
//# sourceMappingURL=testEndpoints.js.map