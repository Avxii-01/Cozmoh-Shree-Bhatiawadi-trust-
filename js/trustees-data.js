/**
 * ==========================================================================
 * SHREE BHATIAWADI TRUST — TRUSTEES DATA REGISTRY (js/trustees-data.js)
 * Central data registry for board trustees, leadership roles, and archival metadata.
 * ==========================================================================
 */

const TRUSTEES_DATA = [
  {
    id: 1,
    name: "Viren Merchant",
    role: "CHAIRPERSON",
    image: "assets/trustees/person7.JPG",
    bio: "A dedicated member of the trust committed to supporting the organisation's mission, preserving its heritage, and serving the community with integrity.",
    appointed: "2005",
    service: "19 years"
  },
  {
    id: 2,
    name: "Mukund Zaveri",
    role: "TRUSTEE MEMBER",
    image: "assets/trustees/person2.JPG",
    bio: "A dedicated member of the trust committed to supporting the organisation's mission, preserving its heritage, and serving the community with integrity.",
    appointed: "2009",
    service: "15 years"
  },
  {
    id: 3,
    name: "Haren Merchant",
    role: "TRUSTEE MEMBER",
    image: "assets/trustees/Haren Merchant Kurta 1.png",
    bio: "A dedicated member of the trust committed to supporting the organisation's mission, preserving its heritage, and serving the community with integrity.",
    appointed: "2005",
    service: "19 years"
  },
  {
    id: 4,
    name: "Meet Merchant",
    role: "TRUSTEE MEMBER",
    image: "assets/trustees/person4.JPG",
    bio: "A dedicated member of the trust committed to supporting the organisation's mission, preserving its heritage, and serving the community with integrity.",
    appointed: "2026",
    service: "New"
  },
  {
    id: 5,
    name: "Bhavik Lilani",
    role: "TRUSTEE MEMBER",
    image: "assets/trustees/person5.JPG",
    bio: "A dedicated member of the trust committed to supporting the organisation's mission, preserving its heritage, and serving the community with integrity.",
    appointed: "2026",
    service: "New"
  },
  {
    id: 6,
    name: "Krish Merchant",
    role: "TRUSTEE MEMBER",
    image: "assets/trustees/person6.JPG",
    bio: "A dedicated member of the trust committed to supporting the organisation's mission, preserving its heritage, and serving the community with integrity.",
    appointed: "2026",
    service: "New"
  },
  {
    id: 7,
    name: "Dheer Merchant",
    role: "TRUSTEE MEMBER",
    image: "assets/trustees/person1.JPG",
    bio: "A dedicated member of the trust committed to supporting the organisation's mission, preserving its heritage, and serving the community with integrity.",
    appointed: "2026",
    service: "New"
  },
  {
    id: 8,
    name: "Manish Merchant",
    role: "TRUSTEE MEMBER",
    image: "assets/trustees/person8.JPG",
    bio: "A dedicated member of the trust committed to supporting the organisation's mission, preserving its heritage, and serving the community with integrity.",
    appointed: "2026",
    service: "New"
  },
  {
    id: 9,
    name: "Rajesh Lilani",
    role: "TRUSTEE MEMBER",
    image: "assets/trustees/person9.JPG",
    bio: "A dedicated member of the trust committed to supporting the organisation's mission, preserving its heritage, and serving the community with integrity.",
    appointed: "2005",
    service: "19 years"
  },
  {
    id: 10,
    name: "Rohit Dhagai",
    role: "TRUSTEE MEMBER",
    image: "assets/trustees/person10.JPG",
    bio: "A dedicated member of the trust committed to supporting the organisation's mission, preserving its heritage, and serving the community with integrity.",
    appointed: "2009",
    service: "15 years"
  },
  {
    id: 11,
    name: "Hemant Lilani",
    role: "TRUSTEE MEMBER",
    image: "assets/trustees/person11.jpg",
    bio: "A dedicated member of the trust committed to supporting the organisation's mission, preserving its heritage, and serving the community with integrity.",
    appointed: "2009",
    service: "15 years"
  }
];

if (typeof window !== 'undefined') {
  window.TRUSTEES_DATA = TRUSTEES_DATA;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TRUSTEES_DATA, TRUSTES_DATA: TRUSTEES_DATA };
}

