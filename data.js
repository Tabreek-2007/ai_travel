const DESTINATION_IMAGES = {
    'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1994&auto=format&fit=crop',
    'paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop',
    'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop',
    'bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2038&auto=format&fit=crop',
    'goa': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1974&auto=format&fit=crop',
    'mumbai': 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?q=80&w=1965&auto=format&fit=crop',
    'singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1952&auto=format&fit=crop',
    'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop',
    'switzerland': 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=2070&auto=format&fit=crop'
};

const POPULAR_DESTINATIONS = [
    { city: 'Tokyo', country: 'Japan', img: DESTINATION_IMAGES['tokyo'], budget: '$$$', season: 'Spring/Autumn', desc: 'Neon lights meet ancient temples.' },
    { city: 'Paris', country: 'France', img: DESTINATION_IMAGES['paris'], budget: '$$$', season: 'Spring/Summer', desc: 'The city of love, art, and exquisite food.' },
    { city: 'Dubai', country: 'UAE', img: DESTINATION_IMAGES['dubai'], budget: '$$$$', season: 'Winter', desc: 'Modern luxury, architecture, and desert safaris.' },
    { city: 'Bali', country: 'Indonesia', img: DESTINATION_IMAGES['bali'], budget: '$$', season: 'Summer', desc: 'Tropical beaches, volcanoes, and vibrant culture.' },
    { city: 'Goa', country: 'India', img: DESTINATION_IMAGES['goa'], budget: '$', season: 'Winter', desc: 'Sun, sand, seafood, and rich heritage.' },
    { city: 'New York', country: 'USA', img: DESTINATION_IMAGES['new york'], budget: '$$$$', season: 'Autumn/Spring', desc: 'The city that never sleeps.' }
];

const FALLBACK_WEATHER = {
    temp: 24,
    condition: 'Clear',
    icon: '01d',
    humidity: 60,
    wind: 12
};

const ATTRACTIONS = {
    'tokyo': ['Shibuya Crossing', 'Tokyo Tower', 'Sensoji Temple', 'Akihabara', 'Meiji Shrine', 'Tsukiji Outer Market', 'Ueno Park', 'Shinjuku Gyoen National Garden'],
    'paris': ['Eiffel Tower', 'Louvre Museum', 'Seine River Cruise', 'Notre-Dame Cathedral', 'Montmartre', 'Arc de Triomphe', 'Palace of Versailles', 'Champs-Élysées'],
    'dubai': ['Burj Khalifa', 'Dubai Mall', 'Desert Safari', 'Palm Jumeirah', 'Dubai Marina', 'Gold Souk', 'Dubai Fountain', 'Miracle Garden'],
    'mumbai': ['Gateway of India', 'Marine Drive', 'Elephanta Caves', 'Colaba Causeway', 'Chhatrapati Shivaji Maharaj Terminus', 'Juhu Beach'],
    'goa': ['Baga Beach', 'Fort Aguada', 'Dudh Sagar Waterfall', 'Basilica of Bom Jesus', 'Anjuna Flea Market', 'Chapora Fort'],
    'singapore': ['Gardens by the Bay', 'Marina Bay Sands', 'Sentosa Island', 'Universal Studios', 'Singapore Zoo', 'Clarke Quay'],
    'new york': ['Statue of Liberty', 'Central Park', 'Times Square', 'Empire State Building', 'Brooklyn Bridge', 'Metropolitan Museum of Art'],
    'switzerland': ['Matterhorn', 'Chillon Castle', 'Jungfraujoch', 'Lake Geneva', 'Rhine Falls', 'Chapel Bridge'],
    'bali': ['Uluwatu Temple', 'Ubud Monkey Forest', 'Tegallalang Rice Terrace', 'Mount Batur', 'Seminyak Beach', 'Tanah Lot Temple']
};

const FOOD_RECOMMENDATIONS = {
    'tokyo': ['Sushi at Tsukiji', 'Ramen in Shinjuku', 'Takoyaki', 'Wagyu Beef'],
    'paris': ['Croissant', 'Macarons', 'Escargots', 'French Onion Soup', 'Crepes'],
    'dubai': ['Shawarma', 'Al Harees', 'Falafel', 'Luqaimat', 'Camel Meat'],
    'mumbai': ['Vada Pav', 'Pav Bhaji', 'Pani Puri', 'Bombay Sandwich'],
    'goa': ['Fish Curry Rice', 'Pork Vindaloo', 'Bebinca', 'Feni'],
    'singapore': ['Hainanese Chicken Rice', 'Chilli Crab', 'Laksa', 'Char Kway Teow'],
    'new york': ['NY Style Pizza', 'Bagel with Cream Cheese', 'Pastrami on Rye', 'Hot Dog'],
    'switzerland': ['Cheese Fondue', 'Raclette', 'Rösti', 'Swiss Chocolate'],
    'bali': ['Babi Guling', 'Nasi Goreng', 'Satay', 'Lawar']
};

const GENERAL_ATTRACTIONS = [
    'Downtown Historical Area', 'Central Park', 'Local Museum of Art', 
    'Main Shopping Boulevard', 'Cultural Heritage Center', 'Riverside Promenade',
    'Botanical Gardens', 'City Observation Deck', 'Grand Market', 'Night Street Food Alley'
];

const PACKING_TIPS = {
    hot: ['Light cotton clothes', 'Sunglasses', 'Sunscreen SPF 50+', 'Hat', 'Sandals', 'Swimwear'],
    moderate: ['T-shirts', 'Light jacket or cardigan', 'Comfortable walking shoes', 'Jeans/trousers', 'Umbrella (just in case)'],
    cold: ['Heavy winter jacket', 'Thermals', 'Gloves and beanie', 'Boots', 'Warm thick socks', 'Scarf']
};

// Helper exports
window.dataApp = {
    DESTINATION_IMAGES,
    POPULAR_DESTINATIONS,
    FALLBACK_WEATHER,
    ATTRACTIONS,
    FOOD_RECOMMENDATIONS,
    GENERAL_ATTRACTIONS,
    PACKING_TIPS
};
