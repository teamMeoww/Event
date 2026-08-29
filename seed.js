const { MongoClient } = require('mongodb');
const crypto = require('crypto');

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'eventone';

async function main() {
  try {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);

    const usersCollection = db.collection('users');
    const eventsCollection = db.collection('events');

    // 1. Create an Organizer User
    const organizerId = crypto.randomUUID();
    const userResult = await usersCollection.insertOne({
      _id: organizerId,
      name: "Admin Organizer",
      email: "admin@eventone.com",
      passwordHash: "dummyhash", // In a real scenario, this would be properly hashed
      roles: ["ATTENDEE", "ORGANIZER", "SCANNER"],
      reputationScore: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
      _class: "com.eventone.authservice.domain.User"
    });
    console.log('Created Organizer User with ID:', organizerId);

    // 2. Create Events
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const events = [
      {
        _id: crypto.randomUUID(),
        title: "Global Tech Conference 2026",
        description: "Join the biggest tech innovators.",
        category: "Technology",
        location: "San Francisco, CA",
        startAt: nextWeek,
        endAt: new Date(nextWeek.getTime() + 2 * 24 * 60 * 60 * 1000),
        capacity: 5000,
        organizerId: organizerId,
        status: "PUBLISHED",
        createdAt: new Date(),
        updatedAt: new Date(),
        _class: "com.eventone.eventservice.domain.Event"
      },
      {
        _id: crypto.randomUUID(),
        title: "Summer Music Festival",
        description: "Three days of non-stop music.",
        category: "Music",
        location: "New York, NY",
        startAt: nextMonth,
        endAt: new Date(nextMonth.getTime() + 3 * 24 * 60 * 60 * 1000),
        capacity: 10000,
        organizerId: organizerId,
        status: "PUBLISHED",
        createdAt: new Date(),
        updatedAt: new Date(),
        _class: "com.eventone.eventservice.domain.Event"
      },
      {
        _id: crypto.randomUUID(),
        title: "Modern Art Exhibition",
        description: "Explore the newest contemporary art.",
        category: "Art",
        location: "London, UK",
        startAt: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
        endAt: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
        capacity: 500,
        organizerId: organizerId,
        status: "PUBLISHED",
        createdAt: new Date(),
        updatedAt: new Date(),
        _class: "com.eventone.eventservice.domain.Event"
      }
    ];

    const eventResult = await eventsCollection.insertMany(events);
    console.log(`Successfully seeded ${eventResult.insertedCount} events`);

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();
