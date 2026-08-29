require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Organization = require('../models/Organization');
const Event = require('../models/Event');
const connectDB = require('../config/db');

const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing data (use with caution in prod!)
    if (process.env.NODE_ENV === 'development') {
      await User.deleteMany();
      await Organization.deleteMany();
      await Event.deleteMany();
    }

    // 1. Create Organizer User
    const organizer = await User.create({
      name: "Acme Event Organizer",
      email: "organizer@example.com",
      password: "password123",
      role: "ORGANIZER"
    });

    // 2. Create Organization
    const organization = await Organization.create({
      name: "Acme Corp Events",
      description: "Hosting the best tech events in town.",
      ownerId: organizer._id,
      members: [{ userId: organizer._id, role: 'ADMIN' }]
    });

    // Update Organizer to link organization
    organizer.organizationId = organization._id;
    await organizer.save();

    // 3. Create Event
    const event = await Event.create({
      title: "Global Tech Hackathon 2026",
      description: "Join the biggest virtual and physical hackathon of the year.",
      shortDescription: "A massive tech hackathon.",
      category: "Technology",
      tags: ["Hackathon", "Web3", "AI"],
      organizerId: organizer._id,
      organizationId: organization._id,
      startDate: new Date(new Date().setHours(new Date().getHours() + 48)), // Starts in 48 hours
      endDate: new Date(new Date().setHours(new Date().getHours() + 96)),
      capacity: 500,
      status: "PUBLISHED",
      isFeatured: true,
      venue: {
        name: "Virtual / SF Convention Center",
        city: "San Francisco"
      }
    });

    // 4. Create Participant
    const participant = await User.create({
      name: "John Doe",
      email: "participant@example.com",
      password: "password123",
      role: "PARTICIPANT"
    });

    // 5. Create Volunteer
    const volunteer = await User.create({
      name: "Jane Smith",
      email: "volunteer@example.com",
      password: "password123",
      role: "VOLUNTEER"
    });
    
    event.volunteers.push(volunteer._id);
    await event.save();

    console.log("Database seeded successfully!");
    console.log("Organizer Email: organizer@example.com");
    console.log("Participant Email: participant@example.com");
    console.log("Volunteer Email: volunteer@example.com");
    console.log("Password for all: password123");

    process.exit();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
