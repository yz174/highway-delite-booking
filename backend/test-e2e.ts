import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:3000/api';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

function logTest(name: string, passed: boolean, error?: string) {
  results.push({ name, passed, error });
  const status = passed ? '✓' : '✗';
  const color = passed ? '\x1b[32m' : '\x1b[31m';
  console.log(`${color}${status}\x1b[0m ${name}`);
  if (error) {
    console.log(`  Error: ${error}`);
  }
}

async function testGetExperiences() {
  try {
    const response = await axios.get(`${API_URL}/experiences`);
    const passed = response.status === 200 && Array.isArray(response.data.data) && response.data.data.length > 0;
    logTest('GET /api/experiences - Fetch all experiences', passed);
    return response.data.data;
  } catch (error: any) {
    logTest('GET /api/experiences - Fetch all experiences', false, error.message);
    return [];
  }
}

async function testSearchExperiences() {
  try {
    const response = await axios.get(`${API_URL}/experiences?search=Kayaking`);
    const passed = response.status === 200 && Array.isArray(response.data.data);
    logTest('GET /api/experiences?search=Kayaking - Search experiences', passed);
  } catch (error: any) {
    logTest('GET /api/experiences?search=Kayaking - Search experiences', false, error.message);
  }
}

async function testGetExperienceDetails(experienceId: string) {
  try {
    const response = await axios.get(`${API_URL}/experiences/${experienceId}`);
    const passed = response.status === 200 && response.data.data.id === experienceId;
    logTest(`GET /api/experiences/${experienceId} - Fetch experience details`, passed);
    return response.data.data;
  } catch (error: any) {
    logTest(`GET /api/experiences/${experienceId} - Fetch experience details`, false, error.message);
    return null;
  }
}

async function testValidPromoCode() {
  try {
    const response = await axios.post(`${API_URL}/promo/validate`, {
      code: 'SAVE10',
      subtotal: 1000
    });
    const passed = response.status === 200 && response.data.data.discountAmount > 0;
    logTest('POST /api/promo/validate - Valid promo code (SAVE10)', passed);
    return response.data.data;
  } catch (error: any) {
    logTest('POST /api/promo/validate - Valid promo code (SAVE10)', false, error.message);
    return null;
  }
}

async function testInvalidPromoCode() {
  try {
    const response = await axios.post(`${API_URL}/promo/validate`, {
      code: 'INVALID',
      subtotal: 1000
    });
    logTest('POST /api/promo/validate - Invalid promo code', false, 'Should have returned error');
  } catch (error: any) {
    const passed = error.response?.status === 400;
    logTest('POST /api/promo/validate - Invalid promo code', passed);
  }
}

async function testCreateBooking(experienceId: string, slotId: string) {
  try {
    const response = await axios.post(`${API_URL}/bookings`, {
      experienceId,
      slotId,
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      quantity: 1,
      customerName: 'Test User',
      customerEmail: 'test@example.com',
      agreedToTerms: true
    });
    const passed = response.status === 201 && response.data.data.referenceId;
    logTest('POST /api/bookings - Create booking with valid data', passed);
    return response.data.data;
  } catch (error: any) {
    logTest('POST /api/bookings - Create booking with valid data', false, error.message);
    return null;
  }
}

async function testBookingValidationErrors() {
  try {
    const response = await axios.post(`${API_URL}/bookings`, {
      experienceId: 'invalid',
      slotId: 'invalid',
      quantity: 1
      // Missing required fields
    });
    logTest('POST /api/bookings - Validation errors', false, 'Should have returned validation error');
  } catch (error: any) {
    const passed = error.response?.status === 400;
    logTest('POST /api/bookings - Validation errors', passed);
  }
}

async function testBookingSoldOutSlot(experienceId: string) {
  try {
    // Try to book a slot that doesn't exist or is sold out
    const response = await axios.post(`${API_URL}/bookings`, {
      experienceId,
      slotId: 'non-existent-slot',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      quantity: 100, // Large quantity to trigger sold out
      customerName: 'Test User',
      customerEmail: 'test@example.com',
      agreedToTerms: true
    });
    logTest('POST /api/bookings - Sold out slot', false, 'Should have returned error');
  } catch (error: any) {
    const passed = error.response?.status === 400 || error.response?.status === 404;
    logTest('POST /api/bookings - Sold out slot', passed);
  }
}

async function runTests() {
  console.log('\n🧪 Starting End-to-End API Tests\n');
  console.log('='.repeat(50));
  console.log('\n📋 Test Flow: Home → Search → Details → Promo → Booking\n');

  // Test 1: Get all experiences (Home page)
  const experiences = await testGetExperiences();
  
  // Test 2: Search experiences
  await testSearchExperiences();

  if (experiences.length > 0) {
    const firstExperience = experiences[0];
    
    // Test 3: Get experience details
    const experienceDetails = await testGetExperienceDetails(firstExperience.id);
    
    if (experienceDetails && experienceDetails.availableDates?.length > 0) {
      const firstDate = experienceDetails.availableDates[0];
      const firstSlot = firstDate.slots?.[0];
      
      if (firstSlot) {
        // Test 4: Valid promo code
        await testValidPromoCode();
        
        // Test 5: Invalid promo code
        await testInvalidPromoCode();
        
        // Test 6: Create booking with valid data
        await testCreateBooking(firstExperience.id, firstSlot.id);
        
        // Test 7: Booking validation errors
        await testBookingValidationErrors();
        
        // Test 8: Sold out slot
        await testBookingSoldOutSlot(firstExperience.id);
      }
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Test Summary\n');
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;
  
  console.log(`Total Tests: ${total}`);
  console.log(`\x1b[32mPassed: ${passed}\x1b[0m`);
  console.log(`\x1b[31mFailed: ${failed}\x1b[0m`);
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
  
  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  - ${r.name}`);
      if (r.error) console.log(`    ${r.error}`);
    });
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
