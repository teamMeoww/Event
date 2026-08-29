const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../src/models/User');
const Organization = require('../src/models/Organization');
const Event = require('../src/models/Event');
const Registration = require('../src/models/Registration');
const Ticket = require('../src/models/Ticket');
const Checkin = require('../src/models/Checkin');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eventone';

// Helpers
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const seedDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Organization.deleteMany({}),
      Event.deleteMany({}),
      Registration.deleteMany({}),
      Ticket.deleteMany({}),
      Checkin.deleteMany({})
    ]);

    const passwordHash = await hashPassword('password123');

    // 1. Create Super Admin
    console.log('Creating users...');
    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'admin@eventone.com',
      password: passwordHash, // Will be double hashed if we don't handle the pre-save hook, but for seed we use direct insertion or bypass
      role: 'SUPER_ADMIN'
    });
    // Fix the double-hashing from pre-save hook by using insertMany for the rest
    await User.findByIdAndUpdate(superAdmin._id, { password: passwordHash });

    // 2. Create Organizations & Organizers
    console.log('Creating organizations and organizers...');
    const orgData = [
      { name: 'Tech Innovators', description: 'Leading tech events' },
      { name: 'Music Mania', description: 'Best concerts in town' },
      { name: 'Artistic Souls', description: 'Art galleries and exhibitions' }
    ];

    const organizations = [];
    const organizers = [];
    const volunteers = [];
    const participants = [];

    let userCounter = 1;

    for (const data of orgData) {
      // Create Organizer first
      const organizer = new User({
        name: `${data.name} Organizer`,
        email: `org${userCounter}@example.com`,
        password: 'password123', // Raw password, pre-save hook handles hashing for new Users
        role: 'ORGANIZER'
      });
      await organizer.save();
      organizers.push(organizer);

      // Create Organization
      const org = await Organization.create({
        ...data,
        ownerId: organizer._id
      });
      organizations.push(org);

      // Update Organizer with org ID
      organizer.organizationId = org._id;
      await organizer.save();

      userCounter++;

      // 5 Volunteers per org
      for (let i = 0; i < 5; i++) {
        const volunteer = new User({
          name: `Volunteer ${userCounter}`,
          email: `vol${userCounter}@example.com`,
          password: 'password123',
          role: 'VOLUNTEER',
          organizationId: org._id,
          hasMobileAccess: true
        });
        await volunteer.save();
        volunteers.push(volunteer);
        userCounter++;
      }
    }

    // 3. Create Participants
    console.log('Creating 50 participants...');
    for (let i = 0; i < 50; i++) {
      const participant = new User({
        name: `Participant ${i+1}`,
        email: `part${i+1}@example.com`,
        password: 'password123',
        role: 'PARTICIPANT'
      });
      await participant.save();
      participants.push(participant);
    }

    // 4. Create Events
    console.log('Creating events...');
    const eventTypes = ['Tech Conference', 'Music Festival', 'Art Workshop', 'Hackathon', 'Networking Meetup'];
    const events = [];

    for (let i = 0; i < 20; i++) {
      const org = randomElement(organizations);
      const isPast = Math.random() > 0.7; // 30% past events
      const now = new Date();
      
      let startDate, endDate;
      if (isPast) {
        startDate = new Date(now.getTime() - randomInt(1, 30) * 24 * 60 * 60 * 1000);
        endDate = new Date(startDate.getTime() + randomInt(2, 8) * 60 * 60 * 1000);
      } else {
        startDate = new Date(now.getTime() + randomInt(1, 30) * 24 * 60 * 60 * 1000);
        endDate = new Date(startDate.getTime() + randomInt(2, 8) * 60 * 60 * 1000);
      }

      const event = await Event.create({
        title: `${org.name} - ${randomElement(eventTypes)} ${i+1}`,
        description: 'An amazing event full of learning, networking, and fun!',
        organizationId: org._id,
        organizerId: org.ownerId,
        startDate,
        endDate,
        location: '123 Event Street, City, Country',
        capacity: randomInt(50, 500),
        status: isPast ? 'COMPLETED' : 'PUBLISHED',
        approvalStatus: 'APPROVED',
        price: randomInt(0, 100),
        coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        volunteers: volunteers.filter(v => v.organizationId.toString() === org._id.toString()).map(v => v._id).slice(0, 3)
      });
      events.push(event);
    }

    // 5. Create Tickets & Checkins
    console.log('Creating tickets and checkins...');
    const tickets = [];
    
    for (const event of events) {
      // 10 to 40 participants per event
      const numParticipants = randomInt(10, 40);
      const eventParticipants = [...participants].sort(() => 0.5 - Math.random()).slice(0, numParticipants);

      const eventVolunteers = event.volunteers;

      for (const participant of eventParticipants) {
        // Generate random ticket code
        const ticketCode = `TKT-${event._id.toString().substring(18).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        
        // Has this ticket been checked in? (More likely for past events)
        const isCheckedIn = event.status === 'COMPLETED' ? Math.random() > 0.1 : Math.random() > 0.7;

        const registration = await Registration.create({
          userId: participant._id,
          eventId: event._id,
          status: 'CONFIRMED'
        });

        const ticket = await Ticket.create({
          eventId: event._id,
          userId: participant._id,
          organizationId: event.organizationId,
          registrationId: registration._id,
          ticketCode: ticketCode,
          status: isCheckedIn ? 'USED' : 'ACTIVE',
          purchasePrice: event.price,
          checkedInAt: isCheckedIn ? randomDate(event.startDate, event.endDate) : null,
          checkedInBy: isCheckedIn && eventVolunteers.length > 0 ? randomElement(eventVolunteers) : null
        });

        registration.ticketId = ticket._id;
        await registration.save();

        tickets.push(ticket);

        if (isCheckedIn && eventVolunteers.length > 0) {
          await Checkin.create({
            ticketId: ticket._id,
            eventId: event._id,
            participantId: participant._id,
            volunteerId: randomElement(eventVolunteers),
            checkedInAt: ticket.checkedInAt
          });
        }
      }
    }

    console.log('--------------------------------------------------');
    console.log('Database seeded successfully!');
    console.log(`Users: ${organizations.length} Orgs, ${organizers.length} Organizers, ${volunteers.length} Volunteers, ${participants.length} Participants`);
    console.log(`Events: ${events.length}`);
    console.log(`Tickets: ${tickets.length}`);
    console.log('--------------------------------------------------');
    console.log('Default Password for all seeded users is: password123');
    console.log('Super Admin: admin@eventone.com');
    console.log('Sample Organizer: org1@example.com');
    console.log('Sample Volunteer: vol1@example.com');
    console.log('Sample Participant: part1@example.com');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
