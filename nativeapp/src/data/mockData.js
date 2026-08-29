export const mockUser = {
  id: 'u1',
  name: 'Anubhav',
  email: 'test@test.com',
  reputation: 847,
  verifiedEvents: 12,
  contributions: 3,
  awards: 2,
};

export const mockEvents = [
  {
    id: 'e1',
    title: 'AI Hackathon',
    date: 'Tomorrow • 10:00 AM',
    fullDate: 'August 30, 2026',
    location: 'DELHI',
    organizer: 'EventOne',
    description: 'Join us for a 24-hour AI Hackathon. Build the future with large language models, computer vision, and more.',
    image: 'https://via.placeholder.com/400x200.png?text=AI+Hackathon',
    isRegistered: true,
    category: 'Tech',
  },
  {
    id: 'e2',
    title: 'Web3 Challenge',
    date: 'Sep 5 • 09:00 AM',
    fullDate: 'September 5, 2026',
    location: 'MUMBAI',
    organizer: 'CryptoInd',
    description: 'Explore the decentralized web, smart contracts, and blockchain technologies at this exclusive summit.',
    image: 'https://via.placeholder.com/400x200.png?text=Web3+Challenge',
    isRegistered: false,
    category: 'Web3',
  },
  {
    id: 'e3',
    title: 'Design Systems Conference',
    date: 'Oct 12 • 10:00 AM',
    fullDate: 'October 12, 2026',
    location: 'BENGALURU',
    organizer: 'DesignX',
    description: 'Learn how to build scalable and maintainable design systems from industry leaders.',
    image: 'https://via.placeholder.com/400x200.png?text=Design+Systems',
    isRegistered: false,
    category: 'Design',
  },
];

export const mockPassportCredentials = [
  {
    id: 'c1',
    title: 'AI Hackathon',
    status: 'Verified',
    type: '🏆',
  },
  {
    id: 'c2',
    title: 'Developer Conference',
    status: 'Verified',
    type: '🎤',
  },
  {
    id: 'c3',
    title: 'Web3 Challenge',
    status: 'Winner',
    type: '🥇',
  },
];

export const mockCategories = [
  { id: '1', name: 'Tech', icon: '💻' },
  { id: '2', name: 'Web3', icon: '🌐' },
  { id: '3', name: 'Design', icon: '🎨' },
  { id: '4', name: 'Business', icon: '💼' },
];
