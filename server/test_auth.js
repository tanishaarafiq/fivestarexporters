const testAuth = async () => {
    const email = `test_${Date.now()}@example.com`;
    const password = 'password123';

    try {
        console.log('Testing Registration...');
        const regRes = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                email,
                password,
                company: 'Test Co'
            })
        });
        const regData = await regRes.json();

        if (!regRes.ok) throw new Error(`Registration failed: ${regData.message}`);
        console.log('✅ Registration Successful:', regData.email);

        console.log('Testing Login...');
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const loginData = await loginRes.json();

        if (!loginRes.ok) throw new Error(`Login failed: ${loginData.message}`);
        console.log('✅ Login Successful. Received Token:', !!loginData.token);
        console.log('✅ Last Login in DB (via response body is not in code but we can check):');

    } catch (error) {
        console.error('❌ Test Failed!', error.message);
    }
};

testAuth();
