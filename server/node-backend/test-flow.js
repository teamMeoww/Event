const API_URL = 'http://localhost:5000/api/v1';

async function testFlow() {
  try {
    console.log('--- Starting End-to-End API Flow Test ---');

    // 1. Create Organizer
    console.log('\n1. Registering Organizer...');
    let orgRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Organizer',
        email: `org_${Date.now()}@test.com`,
        password: 'password123',
        role: 'ORGANIZER'
      })
    });
    orgRes = await orgRes.json();
    if (!orgRes.success) throw new Error(JSON.stringify(orgRes));
    let orgToken = orgRes.data.accessToken;
    console.log('Organizer registered successfully.');

    // 1.5 Create Organization
    console.log('\n1.5. Creating Organization...');
    let orgCreateRes = await fetch(`${API_URL}/organizations`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${orgToken}`
      },
      body: JSON.stringify({
        name: 'Test Org',
        description: 'Testing organization',
        website: 'https://testorg.com'
      })
    });
    orgCreateRes = await orgCreateRes.json();
    if (!orgCreateRes.success) throw new Error(JSON.stringify(orgCreateRes));
    console.log('Organization created successfully.');

    // Note: Re-login as organizer to get updated token with organizationId if needed by JWT
    console.log('\n1.6. Re-logging in Organizer to update token...');
    let loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: orgRes.data.email,
        password: 'password123'
      })
    });
    loginRes = await loginRes.json();
    if (!loginRes.success) throw new Error(JSON.stringify(loginRes));
    orgToken = loginRes.data.accessToken;
    console.log('Organizer logged in successfully with updated token.');

    // 2. Create Event
    console.log('\n2. Creating Event...');
    let eventRes = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${orgToken}`
      },
      body: JSON.stringify({
        title: 'E2E Test Event',
        description: 'An event created by automated testing',
        startDate: new Date(Date.now() + 86400000).toISOString(),
        endDate: new Date(Date.now() + 172800000).toISOString(),
        location: 'Virtual',
        capacity: 100,
        price: 0
      })
    });
    eventRes = await eventRes.json();
    if (!eventRes.success) throw new Error(JSON.stringify(eventRes));
    const eventId = eventRes.data._id;
    console.log(`Event created successfully. Event ID: ${eventId}`);

    // 3. Create Super Admin
    console.log('\n3. Registering Super Admin...');
    let adminRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Super Admin',
        email: `admin_${Date.now()}@test.com`,
        password: 'password123',
        role: 'SUPER_ADMIN'
      })
    });
    adminRes = await adminRes.json();
    if (!adminRes.success) throw new Error(JSON.stringify(adminRes));
    const adminToken = adminRes.data.accessToken;
    console.log('Super Admin registered successfully.');

    // 4. Admin Approves Event
    console.log('\n4. Admin Approving Event...');
    let approveRes = await fetch(`${API_URL}/events/admin/${eventId}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    approveRes = await approveRes.json();
    if (!approveRes.success) throw new Error(JSON.stringify(approveRes));
    console.log('Event approved successfully.');

    // 5. Create Participant
    console.log('\n5. Registering Participant...');
    let participantRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Participant',
        email: `participant_${Date.now()}@test.com`,
        password: 'password123',
        role: 'PARTICIPANT'
      })
    });
    participantRes = await participantRes.json();
    if (!participantRes.success) throw new Error(JSON.stringify(participantRes));
    const participantToken = participantRes.data.accessToken;
    console.log('Participant registered successfully.');

    // 6. Participant Registers for Event
    console.log('\n6. Participant Registering for Event...');
    let registerRes = await fetch(`${API_URL}/events/${eventId}/register`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${participantToken}` }
    });
    registerRes = await registerRes.json();
    if (!registerRes.success) throw new Error(JSON.stringify(registerRes));
    console.log('Participant registered for event successfully.');

    console.log('\n✅ --- Flow Test Completed Successfully! ---');

  } catch (error) {
    console.error('\n❌ --- Flow Test Failed! ---');
    console.error(error.message);
  }
}

testFlow();
