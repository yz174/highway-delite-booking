import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:3000/api';

interface BookingRequest {
  experienceId: string;
  slotId: string;
  date: string;
  time: string;
  quantity: number;
  customerName: string;
  customerEmail: string;
  agreedToTerms: boolean;
}

async function getAvailableSlot() {
  try {
    // Get first experience
    const experiencesResponse = await axios.get(`${API_URL}/experiences`);
    const experiences = experiencesResponse.data.data;
    
    if (experiences.length === 0) {
      throw new Error('No experiences found');
    }
    
    const firstExperience = experiences[0];
    
    // Get experience details with slots
    const detailsResponse = await axios.get(`${API_URL}/experiences/${firstExperience.id}`);
    const details = detailsResponse.data.data;
    
    if (!details.availableDates || details.availableDates.length === 0) {
      throw new Error('No available dates found');
    }
    
    const firstDate = details.availableDates[0];
    const availableSlot = firstDate.slots.find((slot: any) => slot.availableCount > 0);
    
    if (!availableSlot) {
      throw new Error('No available slots found');
    }
    
    return {
      experienceId: firstExperience.id,
      slotId: availableSlot.id,
      date: firstDate.date,
      time: availableSlot.time,
      totalCapacity: availableSlot.totalCapacity,
      availableCount: availableSlot.availableCount
    };
  } catch (error: any) {
    console.error('Error getting available slot:', error.message);
    throw error;
  }
}

async function createBooking(bookingData: BookingRequest, userNumber: number): Promise<any> {
  try {
    const response = await axios.post(`${API_URL}/bookings`, bookingData);
    return {
      success: true,
      userNumber,
      data: response.data.data
    };
  } catch (error: any) {
    return {
      success: false,
      userNumber,
      error: error.response?.data?.error || error.message,
      status: error.response?.status
    };
  }
}

async function testConcurrentBookings() {
  console.log('\n🧪 Testing Concurrent Booking Scenario\n');
  console.log('='.repeat(60));
  
  try {
    // Step 1: Get an available slot
    console.log('\n📋 Step 1: Finding available slot...');
    const slotInfo = await getAvailableSlot();
    
    console.log(`\n✓ Found slot:`);
    console.log(`  Experience ID: ${slotInfo.experienceId}`);
    console.log(`  Slot ID: ${slotInfo.slotId}`);
    console.log(`  Date: ${slotInfo.date}`);
    console.log(`  Time: ${slotInfo.time}`);
    console.log(`  Total Capacity: ${slotInfo.totalCapacity}`);
    console.log(`  Available Count: ${slotInfo.availableCount}`);
    
    // Step 2: Create concurrent booking requests
    const concurrentUsers = slotInfo.availableCount + 3; // Try to book more than available
    console.log(`\n📋 Step 2: Simulating ${concurrentUsers} concurrent users...`);
    console.log(`  (${slotInfo.availableCount} slots available, ${concurrentUsers} users trying to book)`);
    
    const bookingPromises = [];
    
    for (let i = 1; i <= concurrentUsers; i++) {
      const bookingData: BookingRequest = {
        experienceId: slotInfo.experienceId,
        slotId: slotInfo.slotId,
        date: slotInfo.date,
        time: slotInfo.time,
        quantity: 1,
        customerName: `Test User ${i}`,
        customerEmail: `testuser${i}@example.com`,
        agreedToTerms: true
      };
      
      bookingPromises.push(createBooking(bookingData, i));
    }
    
    // Execute all bookings simultaneously
    console.log('\n⏳ Executing concurrent bookings...\n');
    const results = await Promise.all(bookingPromises);
    
    // Step 3: Analyze results
    console.log('='.repeat(60));
    console.log('\n📊 Results:\n');
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`✓ Successful bookings: ${successful.length}`);
    successful.forEach(r => {
      console.log(`  - User ${r.userNumber}: ${r.data.referenceId}`);
    });
    
    console.log(`\n✗ Failed bookings: ${failed.length}`);
    failed.forEach(r => {
      console.log(`  - User ${r.userNumber}: ${r.error.message || r.error} (Status: ${r.status})`);
    });
    
    // Step 4: Verify slot availability
    console.log('\n📋 Step 4: Verifying slot availability...');
    const updatedDetails = await axios.get(`${API_URL}/experiences/${slotInfo.experienceId}`);
    const updatedSlot = updatedDetails.data.data.availableDates
      .find((d: any) => d.date === slotInfo.date)
      ?.slots.find((s: any) => s.id === slotInfo.slotId);
    
    if (updatedSlot) {
      console.log(`\n✓ Updated slot availability:`);
      console.log(`  Available Count: ${updatedSlot.availableCount}`);
      console.log(`  Expected: ${Math.max(0, slotInfo.availableCount - successful.length)}`);
    }
    
    // Step 5: Validation
    console.log('\n' + '='.repeat(60));
    console.log('\n✅ Test Validation:\n');
    
    const tests = [
      {
        name: 'Only available slots were booked',
        passed: successful.length <= slotInfo.availableCount,
        expected: `<= ${slotInfo.availableCount}`,
        actual: successful.length
      },
      {
        name: 'Excess bookings received errors',
        passed: failed.length === Math.max(0, concurrentUsers - slotInfo.availableCount),
        expected: Math.max(0, concurrentUsers - slotInfo.availableCount),
        actual: failed.length
      },
      {
        name: 'Slot availability correctly decremented',
        passed: updatedSlot && updatedSlot.availableCount === Math.max(0, slotInfo.availableCount - successful.length),
        expected: Math.max(0, slotInfo.availableCount - successful.length),
        actual: updatedSlot?.availableCount
      },
      {
        name: 'Failed bookings returned 400 status',
        passed: failed.every(r => r.status === 400 || r.status === 404),
        expected: 'All 400 or 404',
        actual: failed.map(r => r.status).join(', ')
      }
    ];
    
    tests.forEach(test => {
      const status = test.passed ? '✓' : '✗';
      const color = test.passed ? '\x1b[32m' : '\x1b[31m';
      console.log(`${color}${status}\x1b[0m ${test.name}`);
      console.log(`  Expected: ${test.expected}, Actual: ${test.actual}`);
    });
    
    const allPassed = tests.every(t => t.passed);
    
    console.log('\n' + '='.repeat(60));
    if (allPassed) {
      console.log('\n✅ All concurrent booking tests PASSED!\n');
      console.log('The system correctly handles race conditions and prevents double-booking.\n');
      process.exit(0);
    } else {
      console.log('\n❌ Some concurrent booking tests FAILED!\n');
      console.log('The system may have issues with race conditions or slot management.\n');
      process.exit(1);
    }
    
  } catch (error: any) {
    console.error('\n❌ Test failed with error:', error.message);
    console.log('\nMake sure:');
    console.log('  1. Backend server is running');
    console.log('  2. Database is seeded with data');
    console.log('  3. API_URL is correct\n');
    process.exit(1);
  }
}

// Run the test
testConcurrentBookings();
