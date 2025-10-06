import { ID } from "react-native-appwrite";
import { config, databases } from "./appwrite";

const COLLECTIONS = {
  AGENT: config.agentsCollectionId,
  REVIEWS: config.reviewsCollectionId,
  GALLERY: config.galleriesCollectionId,
  PROPERTY: config.propertiesCollectionId,
};

const propertyTypes = ["House", "Townhouse", "Condo", "Duplex", "Studio", "Villa", "Others", "Apartment"];

const galleryImageSets = {
  House: [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
    'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    'https://images.unsplash.com/photo-1591825729269-caeb344f6df2?w=800',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800'
  ],
  Condo: [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'
  ],
  Villa: [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
    'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800'
  ],
  Apartment: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0266?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'
  ],
  Townhouse: [
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'
  ],
  Duplex: [
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'
  ],
  Studio: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0266?w=800',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'
  ],
  Others: [
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'
  ]
};

const realReviewers = [
  {
    name: 'Charlotte Hanlin',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b6c8?w=400',
    reviews: [
      'The apartment is very clean and modern. I really like the interior design. Looks like I\'ll feel at home 😍',
      'Amazing property! Great location and excellent amenities.',
      'Perfect for families. Highly recommend this place!'
    ]
  },
  {
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    reviews: [
      'Outstanding property with great investment potential.',
      'Professional service and beautiful location.',
      'Excellent value for money. Very satisfied!'
    ]
  },
  {
    name: 'Emily Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    reviews: [
      'Beautiful Condo in prime location. Perfect for families.',
      'Love the modern amenities and spacious rooms.',
      'Great neighborhood and friendly community.'
    ]
  },
  {
    name: 'David Thompson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    reviews: [
      'Impressive architecture and design. Highly recommend!',
      'Perfect location with easy access to everything.',
      'Quality construction and attention to detail.'
    ]
  },
  {
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    reviews: [
      'Stunning property with amazing views!',
      'Great investment opportunity in a prime location.',
      'Professional service and beautiful design.'
    ]
  }
];

const agentData = [
  {
    name: 'James Wilson',
    email: 'james.wilson@realestate.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=60&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@realestate.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b6c8?q=60&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@realestate.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=60&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@realestate.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=60&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    name: 'David Thompson',
    email: 'david.thompson@realestate.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=60&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Return 3-5 random facilities as an array (using exact Appwrite enum values)
function pickRandomFacilities(): string[] {
  const allFacilities = ['Laundry', 'Parking', 'Gym', 'Wifi', 'Pet-friendly'];
  const shuffled = [...allFacilities].sort(() => Math.random() - 0.5);
  const count = 3 + Math.floor(Math.random() * 3); // 3..5
  return shuffled.slice(0, Math.min(count, allFacilities.length));
}

export const seedDatabase = async () => {
  try {
    console.log('🚀 Starting unique database seeding...');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    
    // Clear properties
    const existingProperties = await databases.listDocuments(config.databaseId!, COLLECTIONS.PROPERTY!);
    for (const property of existingProperties.documents) {
      await databases.deleteDocument(config.databaseId!, COLLECTIONS.PROPERTY!, property.$id);
      await sleep(60);
    }

    // Clear galleries
    const existingGalleries = await databases.listDocuments(config.databaseId!, COLLECTIONS.GALLERY!);
    for (const gallery of existingGalleries.documents) {
      await databases.deleteDocument(config.databaseId!, COLLECTIONS.GALLERY!, gallery.$id);
      await sleep(60);
    }

    // Clear reviews
    const existingReviews = await databases.listDocuments(config.databaseId!, COLLECTIONS.REVIEWS!);
    for (const review of existingReviews.documents) {
      await databases.deleteDocument(config.databaseId!, COLLECTIONS.REVIEWS!, review.$id);
      await sleep(60);
    }

    // Clear agents
    const existingAgents = await databases.listDocuments(config.databaseId!, COLLECTIONS.AGENT!);
    for (const agent of existingAgents.documents) {
      await databases.deleteDocument(config.databaseId!, COLLECTIONS.AGENT!, agent.$id);
      await sleep(60);
    }

    console.log('✅ Existing data cleared');

    // Create agents
    console.log('👥 Creating agents...');
    const agentIds = [];
    for (const agent of agentData) {
      const agentDoc = await databases.createDocument(
        config.databaseId!,
        COLLECTIONS.AGENT!,
        ID.unique(),
        agent
      );
      agentIds.push(agentDoc.$id);
      await sleep(80);
    }
    console.log(`✅ Created ${agentIds.length} agents`);

    // Create unique properties with galleries and reviews
    console.log('🏠 Creating properties with unique data...');
    for (let i = 0; i < 20; i++) {
      const propertyType = propertyTypes[i % propertyTypes.length];
      const propertyImages = galleryImageSets[propertyType as keyof typeof galleryImageSets];
      
      // Create unique gallery images for this property (linked by relation)
      for (let j = 0; j < 5; j++) {
        await databases.createDocument(
          config.databaseId!,
          COLLECTIONS.GALLERY!,
          ID.unique(),
          {
            image: propertyImages[j],
            property: `property_${i}`,
          }
        );
        await sleep(80);
      }
      
      // Create realistic reviews for this property (linked by relation)
      for (let k = 0; k < 3; k++) {
        const reviewer = realReviewers[k % realReviewers.length];
        await databases.createDocument(
          config.databaseId!,
          COLLECTIONS.REVIEWS!,
          ID.unique(),
          {
            name: reviewer.name,
            avatar: reviewer.avatar,
            review: reviewer.reviews[Math.floor(Math.random() * reviewer.reviews.length)],
            rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
            property: `property_${i}`,
          }
        );
        await sleep(80);
      }
      
      // Create property with unique data (no manual arrays; relations will populate)
      await databases.createDocument(
        config.databaseId!,
        COLLECTIONS.PROPERTY!,
        `property_${i}`,
        {
          name: `${propertyType} Property ${i + 1}`,
          type: propertyType,
          image: propertyImages[0], // Main image
          price: Math.floor(Math.random() * 500000) + 100000,
          description: `Beautiful ${propertyType.toLowerCase()} in prime location. Perfect for families with modern amenities and excellent location.`,
          address: `${Math.floor(Math.random() * 999)} ${propertyType} Street, City ${i + 1}`,
          bedrooms: Math.floor(Math.random() * 4) + 1,
          bathrooms: Math.floor(Math.random() * 3) + 1,
          area: Math.floor(Math.random() * 2000) + 800,
          rating: parseFloat((Math.random() * 1 + 4).toFixed(1)),
          facilities: pickRandomFacilities(),
          geolocation: `${(40.5 + Math.random()).toFixed(4)},${(-74.2 + Math.random()).toFixed(4)}`,
          agent: agentIds[i % agentIds.length]
        }
      );
      await sleep(120);
    }
    
    console.log('✅ Database seeded with unique property data!');
    return { success: true, message: 'Database seeded successfully with unique data' };
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
};
