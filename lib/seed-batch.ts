import { ID, Query } from 'react-native-appwrite';
import { config, databases } from './appwrite';

const databaseId = config.databaseId!;

// Small helper delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Generic batch processor with delays between batches
async function processBatch<T>(
  items: T[],
  processor: (item: T, index: number) => Promise<any>,
  batchSize: number = 3,
  delayMs: number = 1000
) {
  const results: any[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    try {
      const batchResults = await Promise.all(
        batch.map((item, idx) => processor(item, i + idx))
      );
      results.push(...batchResults);
      if (i + batchSize < items.length) {
        console.log(`⏳ Processed batch ${Math.floor(i / batchSize) + 1}, waiting ${delayMs}ms...`);
        await delay(delayMs);
      }
    } catch (error: any) {
      console.error(`❌ Batch ${Math.floor(i / batchSize) + 1} failed:`, error?.message || String(error));
      await delay(delayMs * 2);
    }
  }
  return results;
}

const agentImages = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  'https://images.unsplash.com/photo-1494790108755-2616b612b6c8?w=400',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
];

const propertyImageSets: Record<string, string[]> = {
  House: [
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1591825729269-caeb344f6df2?w=800&h=600&fit=crop',
  ],
  Condo: [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
  ],
  Villa: [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop',
  ],
  Apartment: [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
  ],
  Townhouse: [
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
  ],
  Duplex: [
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
  ],
  Studio: [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
  ],
  Others: [
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
  ],
};

const reviewerData = [
  // Women reviewers - each with unique avatar
  {
    name: 'Charlotte Hanlin',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b6c8?w=400&h=400&fit=crop',
    reviews: [
      "The apartment is very clean and modern. I really like the interior design. Looks like I'll feel at home 😍",
      "Amazing property! Great location and excellent amenities.",
      "Perfect for families. Highly recommend this place!"
    ]
  },
  {
    name: 'Emily Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
    reviews: [
      'Perfect for families. Love the modern amenities and spacious rooms.',
      'Beautiful property in prime location. Perfect for families.',
      'Great neighborhood and friendly community.'
    ]
  },
  {
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    reviews: [
      'Stunning property with amazing views!',
      'Great investment opportunity in a prime location.',
      'Professional service and beautiful design.'
    ]
  },
  {
    name: 'Lisa Anderson',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    reviews: [
      'Beautiful modern design and great amenities.',
      'Perfect for young professionals and families.',
      'Excellent location with everything nearby.'
    ]
  },
  {
    name: 'Jessica Williams',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    reviews: [
      'Absolutely love this property! The design is stunning.',
      'Great investment and perfect for our family.',
      'Excellent location with all amenities nearby.'
    ]
  },
  {
    name: 'Amanda Davis',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop',
    reviews: [
      'Beautiful home with amazing features and great location.',
      'Perfect for families and very well maintained.',
      'Highly recommend this property to anyone looking!'
    ]
  },
  // Men reviewers - each with unique avatar
  {
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    reviews: [
      'Outstanding property with great investment potential and beautiful location.',
      'Professional service and beautiful location.',
      'Excellent value for money. Very satisfied!'
    ]
  },
  {
    name: 'David Thompson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    reviews: [
      'Impressive architecture and design. Highly recommend!',
      'Perfect location with easy access to everything.',
      'Quality construction and attention to detail.'
    ]
  },
  {
    name: 'James Wilson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    reviews: [
      'Fantastic property with excellent facilities.',
      'Great value for money and perfect location.',
      'Highly recommend for anyone looking for quality housing.'
    ]
  },
  {
    name: 'Robert Martinez',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    reviews: [
      'Outstanding property with great potential.',
      'Professional management and excellent service.',
      'Highly satisfied with the purchase decision.'
    ]
  },
  {
    name: 'Christopher Brown',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    reviews: [
      'Excellent property with great investment potential.',
      'Perfect location and amazing amenities.',
      'Highly recommend this property to anyone!'
    ]
  },
  {
    name: 'Daniel Garcia',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    reviews: [
      'Outstanding property with beautiful design and great location.',
      'Professional service and excellent value for money.',
      'Perfect for families and highly recommended!'
    ]
  }
];

const locationCoords = ['40.7128,-74.0060', '34.0522,-118.2437', '41.8781,-87.6298'];

export async function seedWithRateLimit() {
  try {
    console.log('🚀 Starting rate-limited database seeding...');

    // Step 1: Clear existing data with rate limiting
    console.log('🧹 Clearing existing data...');
    const collections = [
      { id: config.propertiesCollectionId!, name: 'properties' },
      { id: config.reviewsCollectionId!, name: 'reviews' },
      { id: config.galleriesCollectionId!, name: 'galleries' },
      { id: config.agentsCollectionId!, name: 'agents' },
    ];

    for (const col of collections) {
      try {
        const existing = await databases.listDocuments(databaseId, col.id, [Query.limit(100)]);
        if (existing.documents.length > 0) {
          await processBatch(
            existing.documents,
            async (doc) => databases.deleteDocument(databaseId, col.id, doc.$id),
            5,
            500
          );
          console.log(`✅ Cleared ${existing.documents.length} from ${col.name}`);
        }
      } catch (error: any) {
        console.log(`⚠️ Clear ${col.name} failed:`, error?.message || String(error));
      }
      await delay(300);
    }

    console.log('✅ Existing data cleared');

    // Step 2: Create agents with rate limiting
    console.log('👥 Creating agents...');
    const agentData = [
      { name: 'Sarah Johnson', email: 'sarah@realestate.com', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b6c8?w=400' },
      { name: 'Michael Chen', email: 'michael@realestate.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
      { name: 'Emily Rodriguez', email: 'emily@realestate.com', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400' },
      { name: 'David Thompson', email: 'david@realestate.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400' },
      { name: 'Lisa Anderson', email: 'lisa@realestate.com', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400' },
    ];

    const agents = await processBatch(
      agentData,
      async (agent) => databases.createDocument(databaseId, config.agentsCollectionId!, ID.unique(), agent),
      1,
      800
    );
    console.log(`✅ Created ${agents.length} agents`);
    await delay(1000);

    // Step 3: Create properties with rate limiting
    console.log('🏠 Creating properties...');
    const propertyTypes = ['House', 'Condo', 'Villa', 'Apartment', 'Townhouse', 'Duplex', 'Studio', 'Others'];
    const propertyData = propertyTypes.map((type, index) => ({
      type,
      name: `${type} Property ${index + 1}`,
      agent: agents[index % agents.length].$id
    }));

    const pickFacilities = () => ['Laundry', 'Parking', 'Gym'];

    // Fallback images for each property type
    const fallbackImages = {
      House: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
      Condo: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      Villa: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
      Apartment: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
      Townhouse: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
      Duplex: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
      Studio: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
      Others: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    };

    const properties = await processBatch(
      propertyData,
      async (pd, index) => {
        const images = propertyImageSets[pd.type];
        const mainImage = images && images[0] ? images[0] : fallbackImages[pd.type as keyof typeof fallbackImages];
        
        return databases.createDocument(databaseId, config.propertiesCollectionId!, ID.unique(), {
          name: pd.name,
          type: pd.type,
          image: mainImage,
          price: Math.floor(Math.random() * 400000) + 150000,
          description: `Beautiful ${pd.type.toLowerCase()} in prime location. Perfect for families.`,
          address: `${100 + index * 50} ${pd.type} Street, City ${index + 1}`,
          bedrooms: Math.floor(Math.random() * 4) + 2,
          bathrooms: Math.floor(Math.random() * 3) + 1,
          area: Math.floor(Math.random() * 1500) + 1000,
          rating: parseFloat((Math.random() * 1 + 4).toFixed(1)),
          facilities: pickFacilities(),
          geolocation: locationCoords[index % locationCoords.length],
          agent: pd.agent,
        });
      },
      1,
      1500
    );
    console.log(`✅ Created ${properties.length} properties`);
    await delay(1500);

    // Step 4: Create reviews and galleries for each property
    console.log('💬 Creating reviews and galleries...');
    const allReviews = [];
    const allGalleries = [];
    
    for (let i = 0; i < properties.length; i++) {
      const property = properties[i];
      const images = propertyImageSets[property.type as keyof typeof propertyImageSets];
      
      console.log(`Creating reviews for ${property.name}...`);
      // Select 3 random reviewers for this property
      const shuffledReviewers = [...reviewerData].sort(() => Math.random() - 0.5).slice(0, 3);
      const propertyReviews = await processBatch(
        shuffledReviewers,
        async (reviewer) =>
          databases.createDocument(databaseId, config.reviewsCollectionId!, ID.unique(), {
            name: reviewer.name,
            avatar: reviewer.avatar,
            review: reviewer.reviews[Math.floor(Math.random() * reviewer.reviews.length)],
            rating: Math.floor(Math.random() * 2) + 4,
          }),
        1,
        900
      );
      allReviews.push(...propertyReviews);
      
      // Store review IDs on property
      try {
        const reviewIds = propertyReviews.map((r: any) => r.$id);
        await databases.updateDocument(
          databaseId,
          config.propertiesCollectionId!,
          property.$id,
          { reviews: reviewIds }
        );
        console.log(`✅ Attached ${reviewIds.length} reviews to ${property.name}`);
      } catch (err) {
        console.log(`⚠️ Failed to attach reviews for ${property.name}:`, err instanceof Error ? err.message : String(err));
      }
      await delay(1200);

      console.log(`Creating gallery for ${property.name}...`);
        const propertyGalleries = await processBatch(
          images,
          async (imageUrl) => {
            // Ensure image URL has proper parameters for better loading
            const optimizedUrl = imageUrl.includes('?') 
              ? imageUrl 
              : `${imageUrl}?w=800&h=600&fit=crop`;
            
            return databases.createDocument(databaseId, config.galleriesCollectionId!, ID.unique(), {
              image: optimizedUrl,
            });
          },
          1,
          700
        );
      allGalleries.push(...propertyGalleries);
      
      // Store gallery IDs on property for now (until schema relations are set up)
      try {
        const galleryIds = propertyGalleries.map((g: any) => g.$id);
        await databases.updateDocument(
          databaseId,
          config.propertiesCollectionId!,
          property.$id,
          { gallery: galleryIds }
        );
        console.log(`✅ Attached ${galleryIds.length} galleries to ${property.name}`);
      } catch (err) {
        console.log(`⚠️ Failed to attach galleries for ${property.name}:`, err instanceof Error ? err.message : String(err));
      }
      await delay(1000);
    }

    // Step 5: Relationships are created through the property field
    console.log('🔗 Relationships created through property relation on reviews and galleries');
    console.log(`✅ Created ${allReviews.length} reviews and ${allGalleries.length} gallery images linked to properties`);

    console.log('🎉 Rate-limited seeding completed successfully!');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Rate-limited seeding failed:', error?.message || String(error));
    return { success: false, error: error?.message || String(error) };
  }
}


