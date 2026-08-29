import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const MOCK_EVENTS = [
  { id: '1', title: 'Google I/O 2026', date: '2026-05-14', location: 'Mountain View, CA', description: 'Annual developer conference.', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87' },
  { id: '2', title: 'WWDC 2026', date: '2026-06-08', location: 'Cupertino, CA', description: 'Worldwide Developers Conference.', image: 'https://images.unsplash.com/photo-1515169067868-5387ec356754' },
  { id: '3', title: 'AWS Student Community Day', date: '2026-09-20', location: 'Bengaluru, India', description: 'Join students and AWS experts to learn about cloud computing, AI, and serverless architectures.', image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1' },
  { id: '4', title: 'D4 Community Day', date: '2026-11-12', location: 'Virtual', description: 'Design, Develop, Deploy, and Disrupt. The ultimate community gathering for modern builders.', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b' }
];

const MOCK_TICKETS = [
  { id: 't1', eventId: '1', type: 'VIP', price: 999, owner: 'Param', status: 'active', qrData: 'eventone://ticket/t1' },
  { id: 't2', eventId: '2', type: 'General', price: 499, owner: 'Param', status: 'active', qrData: 'eventone://ticket/t2' }
];

app.get('/api/events', (req, res) => {
  res.json(MOCK_EVENTS);
});

app.get('/api/events/:id', (req, res) => {
  const event = MOCK_EVENTS.find(e => e.id === req.params.id);
  if (event) res.json(event);
  else res.status(404).json({ error: 'Event not found' });
});

app.get('/api/tickets', (req, res) => {
  res.json(MOCK_TICKETS);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
});
