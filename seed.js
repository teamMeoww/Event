// const { MongoClient } = require('mongodb');
// const crypto = require('crypto');

// // Connection URL
// const url = 'mongodb://localhost:27017';
// const client = new MongoClient(url);

// // Database Name
// const dbName = 'eventone';

// async function main() {
//   try {
//     await client.connect();
//     console.log('Connected successfully to server');
//     const db = client.db(dbName);

//     const usersCollection = db.collection('users');
//     const eventsCollection = db.collection('events');

//     // 1. Create an Organizer User
//     const organizerId = crypto.randomUUID();
//     const userResult = await usersCollection.insertOne({
//       _id: organizerId,
//       name: "Admin Organizer",
//       email: "admin@eventone.com",
//       passwordHash: "dummyhash", // In a real scenario, this would be properly hashed
//       roles: ["ATTENDEE", "ORGANIZER", "SCANNER"],
//       reputationScore: 100,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//       _class: "com.eventone.authservice.domain.User"
//     });
//     console.log('Created Organizer User with ID:', organizerId);

//     // 2. Create Events
//     const now = new Date();
//     const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
//     const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
//     const events = [
//       {
//         _id: crypto.randomUUID(),
//         title: "Global Tech Conference 2026",
//         description: "Join the biggest tech innovators.",
//         category: "Technology",
//         location: "San Francisco, CA",
//         startAt: nextWeek,
//         endAt: new Date(nextWeek.getTime() + 2 * 24 * 60 * 60 * 1000),
//         capacity: 5000,
//         organizerId: organizerId,
//         status: "PUBLISHED",
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         _class: "com.eventone.eventservice.domain.Event"
//       },
//       {
//         _id: crypto.randomUUID(),
//         title: "Summer Music Festival",
//         description: "Three days of non-stop music.",
//         category: "Music",
//         location: "New York, NY",
//         startAt: nextMonth,
//         endAt: new Date(nextMonth.getTime() + 3 * 24 * 60 * 60 * 1000),
//         capacity: 10000,
//         organizerId: organizerId,
//         status: "PUBLISHED",
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         _class: "com.eventone.eventservice.domain.Event"
//       },
//       {
//         _id: crypto.randomUUID(),
//         title: "Modern Art Exhibition",
//         description: "Explore the newest contemporary art.",
//         category: "Art",
//         location: "London, UK",
//         startAt: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
//         endAt: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
//         capacity: 500,
//         organizerId: organizerId,
//         status: "PUBLISHED",
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         _class: "com.eventone.eventservice.domain.Event"
//       }
//     ];

//     const eventResult = await eventsCollection.insertMany(events);
//     console.log(`Successfully seeded ${eventResult.insertedCount} events`);

//   } catch (err) {
//     console.error(err);
//   } finally {
//     await client.close();
//   }
// }

// main();



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

```
const db = client.db(dbName);

const usersCollection = db.collection('users');
const eventsCollection = db.collection('events');

// ==========================================
// 1. CREATE ORGANIZER USER
// ==========================================

const organizerId = crypto.randomUUID();

await usersCollection.insertOne({
  _id: organizerId,
  name: "Admin Organizer",
  email: "admin@eventone.com",
  passwordHash: "dummyhash",
  roles: ["ATTENDEE", "ORGANIZER", "SCANNER"],
  reputationScore: 100,
  createdAt: new Date(),
  updatedAt: new Date(),
  _class: "com.eventone.authservice.domain.User"
});

console.log('Created Organizer User with ID:', organizerId);

// ==========================================
// 2. DATE HELPERS
// ==========================================

const now = new Date();

const addDays = (days) => {
  return new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
};

const addHours = (date, hours) => {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
};

// ==========================================
// 3. CREATE EVENTS
// ==========================================

const events = [

  // ---------------- TECHNOLOGY ----------------

  {
    _id: crypto.randomUUID(),
    title: "Global Tech Conference 2026",
    description:
      "Join the world's leading innovators, developers, entrepreneurs, and technology companies for an exciting three-day technology conference.",
    category: "Technology",
    location: "San Francisco, CA",
    startAt: addDays(7),
    endAt: addDays(9),
    capacity: 5000,
    organizerId,
    status: "PUBLISHED",
    createdAt: new Date(),
    updatedAt: new Date(),
    _class: "com.eventone.eventservice.domain.Event"
  },

  {
    _id: crypto.randomUUID(),
    title: "AI & Machine Learning Summit",
    description:
      "Explore the future of artificial intelligence, generative AI, machine learning, automation, and intelligent systems.",
    category: "Technology",
    location: "Bangalore, India",
    startAt: addDays(12),
    endAt: addDays(13),
    capacity: 2500,
    organizerId,
    status: "PUBLISHED",
    createdAt: new Date(),
    updatedAt: new Date(),
    _class: "com.eventone.eventservice.domain.Event"
  },

  {
    _id: crypto.randomUUID(),
    title: "Web Development Bootcamp",
    description:
      "A hands-on workshop covering modern web development with React, Next.js, Node.js, APIs, and databases.",
    category: "Education",
    location: "Delhi, India",
    startAt: addDays(5),
    endAt: addDays(6),
    capacity: 300,
    organizerId,
    status: "PUBLISHED",
    createdAt: new Date(),
    updatedAt: new Date(),
    _class: "com.eventone.eventservice.domain.Event"
  },

  {
    _id: crypto.randomUUID(),
    title: "Cloud Computing & DevOps Conference",
    description:
      "Learn about cloud infrastructure, Kubernetes, Docker, CI/CD pipelines, and modern DevOps practices.",
    category: "Technology",
    location: "Hyderabad, India",
    startAt: addDays(25),
    endAt: addDays(26),
    capacity: 1800,
    organizerId,
    status: "PUBLISHED",
    createdAt: new Date(),
    updatedAt: new Date(),
    _class: "com.eventone.eventservice.domain.Event"
  },

  // ---------------- MUSIC ----------------

  {
    _id: crypto.randomUUID(),
    title: "Summer Music Festival",
    description:
      "Three days of non-stop music featuring amazing artists, live performances, DJs, food, and entertainment.",
    category: "Music",
    location: "New York, NY",
    startAt: addDays(30),
    endAt: addDays(33),
    capacity: 10000,
    organizerId,
    status: "PUBLISHED",
    createdAt: new Date(),
    updatedAt: new Date(),
    _class: "com.eventone.eventservice.domain.Event"
  },

  {
    _id: crypto.randomUUID(),
    title: "Indie Night Live",
    description:
      "Experience an unforgettable evening with independent artists, acoustic performances, and upcoming musicians.",
    category: "Music",
    location: "Mumbai, India",
    startAt: addDays(18),
    endAt: addHours(addDays(18), 6),
    capacity: 1200,
    organizerId,
    status: "PUBLISHED",
    createdAt: new Date(),
    updatedAt: new Date(),
    _class: "com.eventone.eventservice.domain.Event"
  },

  // ---------------- ART ----------------

  {
    _id: crypto.randomUUID(),
    title: "Modern Art Exhibition",
    description:
      "Explore the newest contemporary art created by talented artists from around the world.",
    category: "Art",
    location: "London, UK",
    startAt: addDays(15),
    endAt: addDays(20),
    capacity: 500,
    organizerId,
    status: "PUBLISHED",
    createdAt: new Date(),
    updatedAt: new Date(),
    _class: "com.eventone.eventservice.domain.Event"
  },

  {
    _id: crypto.randomUUID(),
    title: "Photography & Visual Arts Expo",
    description:
      "Discover breathtaking photography, visual storytelling, creative workshops, and exhibitions.",
    category: "Art",
    location: "Paris, France",
    startAt: addDays(40),
    endAt: addDays(42),
    capacity: 1500,
    organizerId,
    status: "PUBLISHED",
    createdAt: new Date(),
    updatedAt: new Date(),
    _class: "com.eventone.eventservice.domain.Event"
  },

  // ---------------- BUSINESS ----------------

  {
    _id: crypto.randomUUID(),
    title: "Startup & Innovation Summit",
    description:
      "Connect with startup founders, investors, entrepreneurs, mentors, and innovators.",
    category: "Business",
    location: "Singapore",
    startAt: addDays(22),
    endAt: addDays(24),
    capacity: 3000,
    organizerId,
    status: "PUBLISHED",
    createdAt: new Date(),
    updatedAt: new Date(),
    _class: "com.eventone.eventservice.domain.Event"
  },

  {
    _id: crypto.randomUUID(),
    title: "Future of Business Conference",
    description:
      "Discover how technology, AI, remote work, and digital transformation are changing modern businesses.",
    category: "Business",
    location: "Dubai, UAE",
    startAt: addDays(35),
    endAt: addDays(36),
    capacity: 2200,
    organizerId,
    status: "PUBLISHED",
    createdAt: new Date(),
    updatedAt: new Date(),
    _class: "com.eventone.eventservice.domain.Event"
  },

  // ---------------- SPORTS ----------------

  {
    _id: crypto.randomUUID(),
    title: "City Marathon 2026",
    description:
      "Join thousands of runners in an exciting city marathon and celebrate fitness, determination, and community.",
    category: "Sports",
    location: "Chandigarh, India",
    startAt: addDays(20),
    endAt: addHours(addDays(20), 8),
    capacity: 8000,
    organizerId,
    status: "PUBLISHED",
    createdAt: new Date(),
    updatedAt: new Date(),
    _class: "com.eventone.eventservice.domain.Event"
  },

  {
    _id: crypto.randomUUID(),
    title: "National Football Championship",
    description:
      "Watch top football teams compete for the championship in an action-packed tournament.",
    category: "Sports",
    location: "Manchester, UK",
    startAt: addDays(50),
    endAt: addDays(55),
    capacity: 15000,
    organizerId,
    status: "PUBLISHED",
    createdAt: new Date(),
    updatedAt: new Date(),
    _class: "com.eventone.eventservice.domain.Event"
  },

  // ---------------- GAMING ----------------

  {
    _id: crypto.randomUUID(),
    title: "Gaming & Esports Championship",
    description:
      "Compete and watch the best players battle in popular esports tournaments and gaming competitions.",
    category: "Gaming",
    location: "Seoul, South Korea",
    startAt: addDays(28),
    endAt: addDays(30),
    capacity: 6000,
    organizerId,
    status: "PUBLISHED",
    createdAt: new Date(),
    updatedAt: new Date(),
    _class: "com.eventone.eventservice.domain.Event"
  },

  {
    _id: crypto.randomUUID(),
    title: "Game Developers Meetup",
    description:
      "A networking event for game developers, designers, artists, programmers, and gaming enthusiasts.",
    category: "Gaming",
    location: "Pune, India",
    startAt: addDays(16),
    endAt: addHours(addDays(16), 5),
    capacity: 600,
    organizerId,
    status: "PUBLISHED",
    createdAt: new Date(),
    updatedAt: new Date(),
    _class: "com.eventone.eventservice.domain.Event"
  },

  // ---------------- FOOD ----------------

  {
    _id: crypto.randomUUID(),
    title: "International Food Festival",
    description:
      "Taste delicious cuisines from around the world, meet talented chefs, and enjoy live entertainment.",
    category: "Food",
    location: "Toronto, Canada",
    startAt: addDays(45),
    endAt: addDays(47),
    capacity: 7000,
    organizerId,
    status: "PUBLISHED",
    createdAt: new Date(),
    updatedAt: new Date(),
    _class: "com.eventone.eventservice.domain.Event"
  },

  {
    _id: crypto.randomUUID(),
    title: "Punjab Street Food Carnival",
    description:
      "Experience authentic Punjabi street food, local flavors, live music, and exciting food competitions.",
    category: "Food",
    location: "Amritsar, Punjab, India",
    startAt: addDays(10),
    endAt: addDays(12),
    capacity: 4000,
    organizerId,
    status: "PUBLISHED",
    createdAt: new Date(),
    updatedAt: new Date(),
    _class: "com.eventone.eventservice.domain.Event"
  },

  // ---------------- EDUCATION ----------------

  {
    _id: crypto.randomUUID(),
    title: "Career & Technology Expo",
    description:
      "Meet leading companies, explore career opportunities, attend workshops, and connect with recruiters.",
    category: "Education",
    location: "Jalandhar, Punjab, India",
    startAt: addDays(14),
    endAt: addDays(15),
    capacity: 3500,
    organizerId,
    status: "PUBLISHED",
    createdAt: new Date(),
    updatedAt: new Date(),
    _class: "com.eventone.eventservice.domain.Event"
  },

  {
    _id: crypto.randomUUID(),
    title: "Cybersecurity Awareness Workshop",
    description:
      "Learn about ethical hacking, cybersecurity threats, online privacy, and protecting digital systems.",
    category: "Education",
    location: "Chandigarh, India",
    startAt: addDays(8),
    endAt: addHours(addDays(8), 7),
    capacity: 400,
    organizerId,
    status: "PUBLISHED",
    createdAt: new Date(),
    updatedAt: new Date(),
    _class: "com.eventone.eventservice.domain.Event"
  },

  // ---------------- NETWORKING ----------------

  {
    _id: crypto.randomUUID(),
    title: "Developers Networking Meetup",
    description:
      "Meet developers, engineers, designers, and technology enthusiasts from the local community.",
    category: "Networking",
    location: "Bangalore, India",
    startAt: addDays(6),
    endAt: addHours(addDays(6), 4),
    capacity: 500,
    organizerId,
    status: "PUBLISHED",
    createdAt: new Date(),
    updatedAt: new Date(),
    _class: "com.eventone.eventservice.domain.Event"
  },

  {
    _id: crypto.randomUUID(),
    title: "Women in Tech Networking Event",
    description:
      "A professional networking event focused on connecting, supporting, and inspiring women in technology.",
    category: "Networking",
    location: "Delhi, India",
    startAt: addDays(32),
    endAt: addHours(addDays(32), 5),
    capacity: 800,
    organizerId,
    status: "PUBLISHED",
    createdAt: new Date(),
    updatedAt: new Date(),
    _class: "com.eventone.eventservice.domain.Event"
  },

  // ---------------- UPCOMING / DRAFT EVENTS ----------------

  {
    _id: crypto.randomUUID(),
    title: "Blockchain & Web3 Summit",
    description:
      "Explore blockchain technology, decentralized applications, smart contracts, and the future of Web3.",
    category: "Technology",
    location: "Dubai, UAE",
    startAt: addDays(60),
    endAt: addDays(62),
    capacity: 2500,
    organizerId,
    status: "PUBLISHED",
    createdAt: new Date(),
    updatedAt: new Date(),
    _class: "com.eventone.eventservice.domain.Event"
  },

  {
    _id: crypto.randomUUID(),
    title: "EventOne Community Meetup",
    description:
      "An upcoming community meetup for EventOne users, organizers, volunteers, and technology enthusiasts.",
    category: "Networking",
    location: "Phagwara, Punjab, India",
    startAt: addDays(21),
    endAt: addHours(addDays(21), 5),
    capacity: 300,
    organizerId,
    status: "DRAFT",
    createdAt: new Date(),
    updatedAt: new Date(),
    _class: "com.eventone.eventservice.domain.Event"
  }
];

// Insert all events
const eventResult = await eventsCollection.insertMany(events);

console.log(
  `Successfully seeded ${eventResult.insertedCount} events`
);

console.log('Database seeding completed successfully!');
```

} catch (err) {
console.error('Error seeding database:', err);
} finally {
await client.close();
console.log('MongoDB connection closed');
}
}

main();
