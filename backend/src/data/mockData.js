const { v4: uuidv4 } = require('uuid');

const MOCK_USERS = [
  {
    id: 'user-1',
    phone: '+919876543210',
    name: 'Milan',
    gender: 'male',
    ageRange: '25-34',
    preferredStyle: ['casual', 'formal'],
    skinTone: 'medium',
    facePhotos: [],
    location: { city: 'Mumbai', state: 'Maharashtra', country: 'India' },
    isProfileComplete: true
  }
];

const MOCK_WARDROBE_ITEMS = [
  { id: 'item-1', userId: 'user-1', category: 'shirt', tags: ['office_wear', 'formal'], color: 'blue', imageUrl: 'https://picsum.photos/seed/shirt1/400/500' },
  { id: 'item-2', userId: 'user-1', category: 'pants', tags: ['casual'], color: 'navy', imageUrl: 'https://picsum.photos/seed/pants1/400/500' },
  { id: 'item-3', userId: 'user-1', category: 't-shirt', tags: ['casual', 'summer'], color: 'white', imageUrl: 'https://picsum.photos/seed/tshirt1/400/500' },
  { id: 'item-4', userId: 'user-1', category: 'jeans', tags: ['casual', 'favourite'], color: 'blue', imageUrl: 'https://picsum.photos/seed/jeans1/400/500' },
  { id: 'item-5', userId: 'user-1', category: 'blazer', tags: ['formal', 'office_wear'], color: 'black', imageUrl: 'https://picsum.photos/seed/blazer1/400/500' },
  { id: 'item-6', userId: 'user-1', category: 'shoes', tags: ['formal'], color: 'brown', imageUrl: 'https://picsum.photos/seed/shoes1/400/500' }
];

const MOCK_OCCASIONS = [
  { key: 'office', label: 'Office', icon: 'briefcase', sortOrder: 1 },
  { key: 'party', label: 'Party', icon: 'party', sortOrder: 2 },
  { key: 'marriage', label: 'Marriage', icon: 'heart', sortOrder: 3 },
  { key: 'dating', label: 'Dating', icon: 'heart', sortOrder: 4 },
  { key: 'trip', label: 'Trip', icon: 'plane', sortOrder: 5 },
  { key: 'outing', label: 'Outing', icon: 'walk', sortOrder: 6 },
  { key: 'gym', label: 'Gym', icon: 'fitness', sortOrder: 7 },
  { key: 'interview', label: 'Interview', icon: 'briefcase', sortOrder: 8 },
  { key: 'casual_hangout', label: 'Casual Hangout', icon: 'cafe', sortOrder: 9 },
  { key: 'beach_day', label: 'Beach Day', icon: 'sun', sortOrder: 10 },
  { key: 'airport_look', label: 'Airport Look', icon: 'plane', sortOrder: 11 }
];

const MOCK_OUTFITS = [
  {
    id: 'outfit-1',
    itemIds: ['item-1', 'item-2', 'item-6'],
    occasion: 'office',
    aiExplanation: 'This blue shirt enhances your warm undertone. Navy pants create a professional contrast. Temperature is 24°C, perfect for AC office.',
    status: 'suggested'
  },
  {
    id: 'outfit-2',
    itemIds: ['item-3', 'item-4'],
    occasion: 'casual_hangout',
    aiExplanation: 'Relaxed casual look. White tee with blue jeans - timeless combination for a casual day out.',
    status: 'suggested'
  },
  {
    id: 'outfit-3',
    itemIds: ['item-1', 'item-5', 'item-2', 'item-6'],
    occasion: 'interview',
    aiExplanation: 'Sharp formal look. Black blazer over blue shirt - professional and confident.',
    status: 'suggested'
  }
];

const MOCK_NGO_PARTNERS = [
  { id: 'ngo-1', name: 'Goonj', city: 'Mumbai' },
  { id: 'ngo-2', name: 'Uday Foundation', city: 'Delhi' },
  { id: 'ngo-3', name: 'Sewa Bharati', city: 'Bangalore' }
];

module.exports = {
  MOCK_USERS,
  MOCK_WARDROBE_ITEMS,
  MOCK_OCCASIONS,
  MOCK_OUTFITS,
  MOCK_NGO_PARTNERS,
  uuidv4
};
