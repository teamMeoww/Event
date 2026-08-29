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
    image: require('../../assets/images/hackathon.jpg'),
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
    image: require('../../assets/images/web3.jpg'),
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
    image: require('../../assets/images/design.jpg'),
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
  { id: '1', name: 'Tech', icon: '💻', lottie: require('../../assets/CMS computer animation.json') },
  { id: '2', name: 'Web3', icon: '🌐', lottie: require('../../assets/Bitcoin 3d Outline Icon Animation.json'), recolor: '#FFFFFF' },
  { id: '3', name: 'Design', icon: '🎨', lottie: require('../../assets/painting.json') },
];

export const mockWallet = {
  address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  balance: '1.25',
};
