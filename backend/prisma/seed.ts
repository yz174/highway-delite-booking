import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Clear existing data
  await prisma.booking.deleteMany();
  await prisma.slot.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.promoCode.deleteMany();

  // Create promo codes
  console.log('Creating promo codes...');
  const promoCodes = await Promise.all([
    prisma.promoCode.create({
      data: {
        code: 'SAVE10',
        discountType: 'percentage',
        discountValue: 10,
        validFrom: new Date('2025-01-01'),
        validUntil: new Date('2025-12-31'),
        isActive: true,
      },
    }),
    prisma.promoCode.create({
      data: {
        code: 'FLAT100',
        discountType: 'flat',
        discountValue: 100,
        validFrom: new Date('2025-01-01'),
        validUntil: new Date('2025-12-31'),
        isActive: true,
      },
    }),
  ]);
  console.log(`Created ${promoCodes.length} promo codes`);

  // Create experiences
  console.log('Creating experiences...');
  const experiences = [
    {
      name: 'Kayaking',
      location: 'Udupi, Karnataka',
      description: 'Curated small-group experience. Certified guide. Safety briefing.',
      about: 'Experience the thrill of kayaking through scenic routes with trained guides. Includes safety briefing, equipment, and refreshments.',
      imageUrl: 'http://localhost:3000/images/kayaking.png',
      price: 999,
    },
    {
      name: 'Nandi Hills Sunrise',
      location: 'Nandi Hills, Karnataka',
      description: 'Early morning trek to witness breathtaking sunrise views. Guided tour with breakfast.',
      about: 'Start your day with a magical sunrise at Nandi Hills. Includes guided trek, photography spots, and traditional breakfast.',
      imageUrl: 'http://localhost:3000/images/nandi hills.png',
      price: 799,
    },
    {
      name: 'Coffee Trail',
      location: 'Coorg, Karnataka',
      description: 'Explore coffee plantations and learn about coffee making. Includes tasting session.',
      about: 'Walk through lush coffee estates, learn the art of coffee making from bean to cup, and enjoy fresh coffee tasting.',
      imageUrl: 'http://localhost:3000/images/coffee trail.png',
      price: 1299,
    },
    {
      name: 'Boat Cruise',
      location: 'Mandovi River, Goa',
      description: 'Relaxing sunset cruise with live music and dinner. Perfect for families and couples.',
      about: 'Enjoy a serene evening on the Mandovi River with live entertainment, delicious dinner, and stunning sunset views.',
      imageUrl: 'http://localhost:3000/images/boat cruise.png',
      price: 1499,
    },
    {
      name: 'Bungee Jumping',
      location: 'Rishikesh, Uttarakhand',
      description: 'Adrenaline-pumping bungee jump from 83 meters. Safety certified and experienced crew.',
      about: 'Take the leap of faith with India\'s highest bungee jump. Includes safety gear, training, and video recording of your jump.',
      imageUrl: 'http://localhost:3000/images/bungee jumping.png',
      price: 3500,
    },
  ];

  const createdExperiences: Array<{ id: string; name: string }> = [];
  for (const exp of experiences) {
    const experience = await prisma.experience.create({
      data: exp,
    });
    createdExperiences.push(experience);
  }
  console.log(`Created ${createdExperiences.length} experiences`);

  // Create slots for each experience
  console.log('Creating slots...');
  const today = new Date();
  const slotCount = { total: 0 };

  for (const experience of createdExperiences) {
    // Create slots for the next 30 days
    for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
      const slotDate = new Date(today);
      slotDate.setDate(today.getDate() + dayOffset);

      // Create morning and afternoon slots
      const times = ['07:00:00', '09:00:00', '14:00:00', '16:00:00'];
      
      for (const time of times) {
        await prisma.slot.create({
          data: {
            experienceId: experience.id,
            date: slotDate,
            time: new Date(`1970-01-01T${time}`),
            totalCapacity: 10,
            availableCount: Math.floor(Math.random() * 11), // Random availability 0-10
          },
        });
        slotCount.total++;
      }
    }
  }
  console.log(`Created ${slotCount.total} slots`);

  console.log('Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
