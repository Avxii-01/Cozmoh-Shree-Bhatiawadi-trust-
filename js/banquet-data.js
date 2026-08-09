/**
 * ==========================================================================
 * SHREE BHATIAWADI TRUST — VENUE COLLECTION DATA ARCHITECTURE
 * Dynamic data structure for 4 premium banquet halls
 * ==========================================================================
 */

window.venueCollectionData = [
  {
    id: 'basil-hall',
    number: '01',
    name: 'Basil Hall',
    tagline: 'GRAND. ELEGANT. TIMELESS.',
    description: 'A grand and spacious venue designed for large celebrations, wedding receptions, and cultural galas with exceptional comfort and world-class facilities.',
    seatingCapacity: '400',
    seatingLabel: 'SEATED CAPACITY',
    movingCapacity: '600',
    movingLabel: 'MOVING CAPACITY',
    images: [
      'assets/banquets/hall1.png',
      'assets/banquets/hall2.png',
      'assets/banquets/hall3.png'
    ],
    amenities: [
      { name: 'Fully AC', icon: '<path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' },
      { name: 'JBL Sound', icon: '<path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' },
      { name: 'Stage Setup', icon: '<rect x="3" y="14" width="18" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/><path d="M7 14l5-8 5 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' },
      { name: 'VFX Lighting', icon: '<path d="M12 2L15 8L21 9L17 14L18 20L12 17L6 20L7 14L3 9L9 8L12 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>' },
      { name: 'LED Screens', icon: '<rect x="2" y="4" width="20" height="13" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M8 20h8M12 17v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' },
      { name: 'DJ Operator', icon: '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M12 3v6" stroke="currentColor" stroke-width="1.5"/>' },
      { name: 'Changing Rooms', icon: '<path d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' },
      { name: 'High-Speed Wi-Fi', icon: '<path d="M5 12.55a11 11 0 0114 0M8.5 16a7 7 0 017 0M12 19h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' },
      { name: 'Valet Parking', icon: '<rect x="4" y="3" width="16" height="18" rx="3" stroke="currentColor" stroke-width="1.5"/><path d="M9 17V7h4a3 3 0 010 6H9" stroke="currentColor" stroke-width="1.5"/>' }
    ],
    bookingUrl: 'contact.html#book-basil'
  },
  {
    id: 'leaf-hall',
    number: '02',
    name: 'Leaf Hall',
    tagline: 'SERENE. REFINED. CHARMING.',
    description: 'An elegantly appointed banquet hall suitable for medium-sized functions, engagement ceremonies, anniversary parties, and corporate seminars.',
    seatingCapacity: '250',
    seatingLabel: 'SEATED CAPACITY',
    movingCapacity: '400',
    movingLabel: 'MOVING CAPACITY',
    images: [
      'assets/banquets/hall2.png',
      'assets/banquets/hall3.png',
      'assets/banquets/hall4.png'
    ],
    amenities: [
      { name: 'Fully AC', icon: '<path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' },
      { name: 'JBL Sound', icon: '<path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' },
      { name: 'Stage Setup', icon: '<rect x="3" y="14" width="18" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/><path d="M7 14l5-8 5 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' },
      { name: 'LED Screens', icon: '<rect x="2" y="4" width="20" height="13" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M8 20h8M12 17v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' },
      { name: 'Light Operator', icon: '<path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" stroke-width="1.5"/>' },
      { name: 'Changing Rooms', icon: '<path d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' },
      { name: 'High-Speed Wi-Fi', icon: '<path d="M5 12.55a11 11 0 0114 0M8.5 16a7 7 0 017 0M12 19h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' },
      { name: 'Valet Parking', icon: '<rect x="4" y="3" width="16" height="18" rx="3" stroke="currentColor" stroke-width="1.5"/><path d="M9 17V7h4a3 3 0 010 6H9" stroke="currentColor" stroke-width="1.5"/>' }
    ],
    bookingUrl: 'contact.html#book-leaf'
  },
  {
    id: 'lotus-hall',
    number: '03',
    name: 'Lotus Hall',
    tagline: 'INTIMATE. REGAL. PRESTIGIOUS.',
    description: 'A cozy yet regal venue crafted specifically for intimate family gatherings, traditional rituals, birthday celebrations, and executive meetings.',
    seatingCapacity: '150',
    seatingLabel: 'SEATED CAPACITY',
    movingCapacity: '250',
    movingLabel: 'MOVING CAPACITY',
    images: [
      'assets/banquets/hall3.png',
      'assets/banquets/hall4.png',
      'assets/banquets/hall1.png'
    ],
    amenities: [
      { name: 'Fully AC', icon: '<path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' },
      { name: 'JBL Sound', icon: '<path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' },
      { name: 'LED Screens', icon: '<rect x="2" y="4" width="20" height="13" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M8 20h8M12 17v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' },
      { name: 'Changing Rooms', icon: '<path d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' },
      { name: 'High-Speed Wi-Fi', icon: '<path d="M5 12.55a11 11 0 0114 0M8.5 16a7 7 0 017 0M12 19h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' },
      { name: 'Valet Parking', icon: '<rect x="4" y="3" width="16" height="18" rx="3" stroke="currentColor" stroke-width="1.5"/><path d="M9 17V7h4a3 3 0 010 6H9" stroke="currentColor" stroke-width="1.5"/>' }
    ],
    bookingUrl: 'contact.html#book-lotus'
  },
  {
    id: 'orchid-hall',
    number: '04',
    name: 'Orchid Hall',
    tagline: 'OPULENT. MAJESTIC. EXPANSIVE.',
    description: 'A lavishly styled venue featuring intricate heritage motifs, grand chandeliers, and flexible layout options for grand sangeet & reception functions.',
    seatingCapacity: '350',
    seatingLabel: 'SEATED CAPACITY',
    movingCapacity: '550',
    movingLabel: 'MOVING CAPACITY',
    images: [
      'assets/banquets/hall4.png',
      'assets/banquets/hall1.png',
      'assets/banquets/hall2.png'
    ],
    amenities: [
      { name: 'Fully AC', icon: '<path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' },
      { name: 'JBL Sound', icon: '<path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' },
      { name: 'Stage Setup', icon: '<rect x="3" y="14" width="18" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/><path d="M7 14l5-8 5 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' },
      { name: 'VFX Lighting', icon: '<path d="M12 2L15 8L21 9L17 14L18 20L12 17L6 20L7 14L3 9L9 8L12 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>' },
      { name: 'LED Screens', icon: '<rect x="2" y="4" width="20" height="13" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M8 20h8M12 17v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' },
      { name: 'Changing Rooms', icon: '<path d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' },
      { name: 'High-Speed Wi-Fi', icon: '<path d="M5 12.55a11 11 0 0114 0M8.5 16a7 7 0 017 0M12 19h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' },
      { name: 'Valet Parking', icon: '<rect x="4" y="3" width="16" height="18" rx="3" stroke="currentColor" stroke-width="1.5"/><path d="M9 17V7h4a3 3 0 010 6H9" stroke="currentColor" stroke-width="1.5"/>' }
    ],
    bookingUrl: 'contact.html#book-orchid'
  }
];
