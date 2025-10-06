import { ID } from "react-native-appwrite";
import { config, databases } from "./appwrite";
import {
  agentImages,
  galleryImages,
  propertiesImages,
  reviewImages,
} from "./data";

const COLLECTIONS = {
  AGENT: config.agentsCollectionId,
  REVIEWS: config.reviewsCollectionId,
  GALLERY: config.galleriesCollectionId,
  PROPERTY: config.propertiesCollectionId,
};

const propertyTypes = [
  "House",
  "Townhouse",
  "Condo",
  "Duplex",
  "Studio",
  "Villa",
  "Apartment",
  "Others",
];

const facilities = [
  "Laundry",
  "Parking", 
  "Gym",
  "Wifi",
  "Pet-friendly",
];

const agentNames = [
  "Sarah Johnson",
  "Michael Chen", 
  "Emily Rodriguez",
  "David Thompson",
  "Lisa Wang",
  "James Wilson",
  "Maria Garcia",
  "Robert Brown",
  "Jennifer Lee",
  "Christopher Davis",
];

const agentEmails = [
  "sarah.johnson@realestate.com",
  "michael.chen@realestate.com",
  "emily.rodriguez@realestate.com", 
  "david.thompson@realestate.com",
  "lisa.wang@realestate.com",
  "james.wilson@realestate.com",
  "maria.garcia@realestate.com",
  "robert.brown@realestate.com",
  "jennifer.lee@realestate.com",
  "christopher.davis@realestate.com",
];

function getRandomSubset<T>(
  array: T[],
  minItems: number,
  maxItems: number
): T[] {
  // Return empty array if input array is empty
  if (array.length === 0) {
    console.warn(`⚠️ getRandomSubset: Input array is empty, returning empty array`);
    return [];
  }
  
  if (minItems > maxItems) {
    throw new Error("minItems cannot be greater than maxItems");
  }
  if (minItems < 0 || maxItems > array.length) {
    throw new Error(
      "minItems or maxItems are out of valid range for the array"
    );
  }

  // Generate a random size for the subset within the range [minItems, maxItems]
  const subsetSize =
    Math.floor(Math.random() * (maxItems - minItems + 1)) + minItems;

  // Create a copy of the array to avoid modifying the original
  const arrayCopy = [...array];

  // Shuffle the array copy using Fisher-Yates algorithm
  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [arrayCopy[i], arrayCopy[randomIndex]] = [
      arrayCopy[randomIndex],
      arrayCopy[i],
    ];
  }

  // Return the first `subsetSize` elements of the shuffled array
  return arrayCopy.slice(0, subsetSize);
}

async function seed() {
  try {
    console.log("🚀 Using RATE-LIMITED seeding approach...");
    const { seedWithRateLimit } = await import("./seed-batch");
    return await seedWithRateLimit();
  } catch (error) {
    console.error("❌ Rate-limited seeding failed, falling back to UNIQUE:", error);
    try {
      console.log("🚀 Using UNIQUE seeding approach...");
      const { seedDatabase } = await import("./seed-unique");
      return await seedDatabase();
    } catch (uniqueError) {
      console.error("❌ Unique seeding failed, falling back to SIMPLE FIX:", uniqueError);
      try {
        console.log("🚀 Using SIMPLE FIX seeding approach...");
        const { seedSimpleFix } = await import("./seed-simple-fix");
        return await seedSimpleFix();
      } catch (simpleError) {
        console.error("❌ Simple fix seeding failed, falling back to DIRECT:", simpleError);
        try {
          console.log("🚀 Using DIRECT seeding approach...");
          return await seedDirect();
        } catch (directError) {
          console.error("❌ Direct seeding also failed, falling back to ORIGINAL:", directError);
          return await seedOriginal();
        }
      }
    }
  }
}

async function seedDirect() {
  try {
    console.log("🚀 Starting DIRECT seeding approach...");
    
    // Step 1: Clear existing data first
    console.log("🧹 Clearing existing data...");
    try {
      // Clear properties
      const existingProperties = await databases.listDocuments(config.databaseId!, COLLECTIONS.PROPERTY!);
      for (const prop of existingProperties.documents) {
        await databases.deleteDocument(config.databaseId!, COLLECTIONS.PROPERTY!, prop.$id);
      }
      console.log(`✅ Cleared ${existingProperties.documents.length} properties`);
      
      // Clear reviews
      const existingReviews = await databases.listDocuments(config.databaseId!, COLLECTIONS.REVIEWS!);
      for (const review of existingReviews.documents) {
        await databases.deleteDocument(config.databaseId!, COLLECTIONS.REVIEWS!, review.$id);
      }
      console.log(`✅ Cleared ${existingReviews.documents.length} reviews`);
      
      // Clear galleries
      const existingGalleries = await databases.listDocuments(config.databaseId!, COLLECTIONS.GALLERY!);
      for (const gallery of existingGalleries.documents) {
        await databases.deleteDocument(config.databaseId!, COLLECTIONS.GALLERY!, gallery.$id);
      }
      console.log(`✅ Cleared ${existingGalleries.documents.length} galleries`);
      
      // Clear agents
      const existingAgents = await databases.listDocuments(config.databaseId!, COLLECTIONS.AGENT!);
      for (const agent of existingAgents.documents) {
        await databases.deleteDocument(config.databaseId!, COLLECTIONS.AGENT!, agent.$id);
      }
      console.log(`✅ Cleared ${existingAgents.documents.length} agents`);
    } catch (clearError) {
      console.log("⚠️ Clear error (continuing anyway):", clearError);
    }
    
    // Step 2: Create agents
    console.log("👥 Creating agents...");
    const agents = [];
    for (let i = 0; i < agentNames.length; i++) {
      try {
        const agent = await databases.createDocument(
          config.databaseId!,
          COLLECTIONS.AGENT!,
          ID.unique(),
          {
            name: agentNames[i],
            email: agentEmails[i],
            avatar: agentImages[i],
          }
        );
        agents.push(agent);
        console.log(`✅ Agent ${i + 1}: ${agent.name} (${agent.$id})`);
      } catch (agentError) {
        console.error(`❌ Failed to create agent ${i + 1}:`, agentError);
      }
    }
    
    // Step 3: Create reviews (standalone)
    console.log("💬 Creating reviews...");
    const reviews = [];
    for (let i = 0; i < 20; i++) {
      try {
        const review = await databases.createDocument(
          config.databaseId!,
          COLLECTIONS.REVIEWS!,
          ID.unique(),
          {
            name: `Reviewer ${i + 1}`,
            avatar: reviewImages[i % reviewImages.length],
            review: `This is a great property! I love the location and amenities. Rating: ${Math.floor(Math.random() * 5) + 1}/5`,
            rating: Math.floor(Math.random() * 5) + 1,
          }
        );
        reviews.push(review);
        console.log(`✅ Review ${i + 1}: ${review.$id}`);
      } catch (reviewError) {
        console.error(`❌ Failed to create review ${i + 1}:`, reviewError);
      }
    }
    
    // Step 4: Create galleries (standalone)
    console.log("🖼️ Creating galleries...");
    const galleries = [];
    for (let i = 0; i < galleryImages.length; i++) {
      try {
        const gallery = await databases.createDocument(
          config.databaseId!,
          COLLECTIONS.GALLERY!,
          ID.unique(),
          {
            image: galleryImages[i],
          }
        );
        galleries.push(gallery);
        console.log(`✅ Gallery ${i + 1}: ${gallery.$id}`);
      } catch (galleryError) {
        console.error(`❌ Failed to create gallery ${i + 1}:`, galleryError);
      }
    }
    
    // Step 5: Create properties with embedded review/gallery IDs
    console.log("🏠 Creating properties...");
    const properties = [];
    for (let i = 0; i < propertyTypes.length; i++) {
      try {
        const agent = agents[i % agents.length];
        
        const selectedFacilities = facilities
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 3) + 1);

        // Assign reviews and galleries to this property
        const assignedReviews = reviews.slice(i * 2, (i + 1) * 2 + 1);
        const assignedGalleries = galleries.slice(i, i + 2);

        const propertyData = {
          name: `${propertyTypes[i]} Property ${i + 1}`,
          type: propertyTypes[i],
          description: `Beautiful ${propertyTypes[i]} in prime location. Perfect for families.`,
          address: `${i + 1} ${propertyTypes[i]} Street, City ${i + 1}`,
          geolocation: `40.7128, -74.0060`,
          price: Math.floor(Math.random() * 5000) + 1000,
          area: Math.floor(Math.random() * 2000) + 500,
          bedrooms: Math.floor(Math.random() * 4) + 1,
          bathrooms: Math.floor(Math.random() * 3) + 1,
          rating: Math.floor(Math.random() * 2) + 4,
          facilities: selectedFacilities,
          image: propertiesImages[i] || propertiesImages[0],
          agent: agent.$id,
          // Store reviews and galleries as comma-separated strings instead of arrays
          reviews: assignedReviews.map(r => r.$id).join(','),
          gallery: assignedGalleries.map(g => g.$id).join(','),
        };
        
        const property = await databases.createDocument(
          config.databaseId!,
          COLLECTIONS.PROPERTY!,
          ID.unique(),
          propertyData
        );
        
        properties.push(property);
        console.log(`✅ Property ${i + 1}: ${property.name} (${property.$id})`);
        console.log(`   - Reviews: ${assignedReviews.length}`);
        console.log(`   - Galleries: ${assignedGalleries.length}`);
      } catch (propertyError) {
        console.error(`❌ Failed to create property ${i + 1}:`, propertyError);
      }
    }
    
    // Step 6: Final verification
    console.log("🧪 Final verification...");
    const finalProperties = await databases.listDocuments(config.databaseId!, COLLECTIONS.PROPERTY!);
    const finalReviews = await databases.listDocuments(config.databaseId!, COLLECTIONS.REVIEWS!);
    const finalGalleries = await databases.listDocuments(config.databaseId!, COLLECTIONS.GALLERY!);
    const finalAgents = await databases.listDocuments(config.databaseId!, COLLECTIONS.AGENT!);
    
    console.log(`📊 Final counts:`);
    console.log(`   - Properties: ${finalProperties.documents.length}`);
    console.log(`   - Reviews: ${finalReviews.documents.length}`);
    console.log(`   - Galleries: ${finalGalleries.documents.length}`);
    console.log(`   - Agents: ${finalAgents.documents.length}`);
    
    // Test a specific property
    if (finalProperties.documents.length > 0) {
      const testProperty = finalProperties.documents[0];
      console.log(`🧪 Test property: ${testProperty.name}`);
      console.log(`   - Reviews stored: ${testProperty.reviews?.length || 0}`);
      console.log(`   - Galleries stored: ${testProperty.gallery?.length || 0}`);
    }
    
    console.log("🎉 DIRECT seeding completed successfully!");
    return true;
    
  } catch (error) {
    console.error("❌ DIRECT seeding failed:", error);
    console.error("❌ Error details:", JSON.stringify(error, null, 2));
    throw error;
  }
}

async function seedOriginal() {
  try {
    // Test if collections exist
    console.log(`🔍 Testing collections...`);
    console.log(`📊 Reviews Collection ID: ${config.reviewsCollectionId}`);
    console.log(`📊 Galleries Collection ID: ${config.galleriesCollectionId}`);
    console.log(`📊 Agents Collection ID: ${config.agentsCollectionId}`);
    console.log(`📊 Properties Collection ID: ${config.propertiesCollectionId}`);
    
    // Test data arrays
    console.log(`🔍 Data arrays...`);
    console.log(`📊 Gallery images count: ${galleryImages.length}`);
    console.log(`📊 Review images count: ${reviewImages.length}`);
    console.log(`📊 Agent images count: ${agentImages.length}`);
    console.log(`📊 Property images count: ${propertiesImages.length}`);
    
    // Clear existing data from all collections
    const collectionKeys = Object.keys(COLLECTIONS) as Array<keyof typeof COLLECTIONS>;
    for (const key of collectionKeys) {
      const collectionId = COLLECTIONS[key];
      const documents = await databases.listDocuments(
        config.databaseId!,
        collectionId!
      );
      for (const doc of documents.documents) {
        await databases.deleteDocument(
          config.databaseId!,
          collectionId!,
          doc.$id
        );
      }
    }

    console.log("Cleared all existing data.");

    // Seed Agents with realistic data
    const agentNames = [
      "Sarah Johnson", "Michael Chen", "Emily Rodriguez", "David Thompson", "Lisa Anderson",
      "James Wilson", "Maria Garcia", "Robert Brown", "Jennifer Davis", "Christopher Lee"
    ];
    
    const agentEmails = [
      "sarah.johnson@realestate.com", "michael.chen@realestate.com", "emily.rodriguez@realestate.com",
      "david.thompson@realestate.com", "lisa.anderson@realestate.com", "james.wilson@realestate.com",
      "maria.garcia@realestate.com", "robert.brown@realestate.com", "jennifer.davis@realestate.com",
      "christopher.lee@realestate.com"
    ];
    
    const agents = [];
    for (let i = 0; i < agentNames.length; i++) {
      console.log(`Creating agent ${i + 1}: ${agentNames[i]} with image: ${agentImages[i]}`);
      const agent = await databases.createDocument(
        config.databaseId!,
        COLLECTIONS.AGENT!,
        ID.unique(),
        {
          name: agentNames[i],
          email: agentEmails[i],
          avatar: agentImages[i], // Use specific avatar for each agent
        }
      );
      agents.push(agent);
    }
    console.log(`Seeded ${agents.length} agents.`);

    // Seed Reviews - Create reviews without property_id for now
    console.log(`🌱 Starting to create reviews...`);
    const reviews = [];
    for (let i = 1; i <= 20; i++) {
      try {
        const selectedImage = reviewImages[Math.floor(Math.random() * reviewImages.length)];
        console.log(`Creating review ${i} with image: ${selectedImage}`);
      const review = await databases.createDocument(
        config.databaseId!,
        COLLECTIONS.REVIEWS!,
        ID.unique(),
        {
          name: `Reviewer ${i}`,
            avatar: selectedImage,
            review: `This is a great property! I love the location and the amenities. Highly recommended for anyone looking for a comfortable place to live.`,
          rating: Math.floor(Math.random() * 5) + 1, // Rating between 1 and 5
        }
      );
      reviews.push(review);
        console.log(`✅ Created review ${i}: ${review.$id}`);
      } catch (error) {
        console.error(`❌ Failed to create review ${i}:`, error);
        console.error(`❌ Error details:`, JSON.stringify(error, null, 2));
        // Continue with next review instead of failing completely
      }
    }
    console.log(`Seeded ${reviews.length} reviews.`);

    // Seed Galleries - Create galleries without property_id for now
    console.log(`🌱 Starting to create galleries...`);
    const galleries = [];
    for (let i = 0; i < galleryImages.length; i++) {
      try {
        const image = galleryImages[i];
        console.log(`Creating gallery ${i + 1} with image: ${image}`);
      const gallery = await databases.createDocument(
        config.databaseId!,
        COLLECTIONS.GALLERY!,
        ID.unique(),
          { 
            image: image,
          }
      );
      galleries.push(gallery);
        console.log(`✅ Created gallery ${i + 1}: ${gallery.$id}`);
      } catch (error) {
        console.error(`❌ Failed to create gallery ${i + 1}:`, error);
        console.error(`❌ Error details:`, JSON.stringify(error, null, 2));
        // Continue with next gallery instead of failing completely
      }
    }

    console.log(`Seeded ${galleries.length} galleries.`);
    console.log(`🔍 Gallery array contents:`, galleries.map(g => ({ id: g.$id, image: g.image })));
    console.log(`🔍 Reviews array contents:`, reviews.map(r => ({ id: r.$id, name: r.name })));

    // Update existing properties to include reviews and gallery arrays
    console.log(`🔄 Updating existing properties with reviews and gallery arrays...`);
    try {
      const existingProperties = await databases.listDocuments(
        config.databaseId!,
        COLLECTIONS.PROPERTY!
      );
      
      console.log(`📊 Found ${existingProperties.documents.length} existing properties to update`);
      
      for (const property of existingProperties.documents) {
        try {
          // Check if property already has reviews and gallery arrays
          if (property.reviews && property.gallery) {
            console.log(`⏭️ Property ${property.$id} already has reviews and gallery arrays, skipping...`);
            continue;
          }
          
          // Assign random reviews and galleries to existing property
          const assignedReviews = reviews.length > 0 ? getRandomSubset(reviews, 3, 6) : [];
          const assignedGalleries = galleries.length > 0 ? getRandomSubset(galleries, 2, 5) : [];
          
          console.log(`🔄 Updating property ${property.$id} with ${assignedReviews.length} reviews and ${assignedGalleries.length} galleries`);
          
          await databases.updateDocument(
            config.databaseId!,
            COLLECTIONS.PROPERTY!,
            property.$id,
            {
              reviews: assignedReviews.map((review) => review.$id),
              gallery: assignedGalleries.map((gallery) => gallery.$id),
            }
          );
          
          console.log(`✅ Updated property ${property.$id} successfully`);
        } catch (updateError) {
          console.error(`❌ Failed to update property ${property.$id}:`, updateError);
        }
      }
      
      console.log(`✅ Finished updating existing properties`);
    } catch (error) {
      console.error(`❌ Error updating existing properties:`, error);
    }
    
    // Check if arrays are actually populated
    if (galleries.length === 0) {
      console.error(`❌ CRITICAL: Galleries array is empty!`);
    }
    if (reviews.length === 0) {
      console.error(`❌ CRITICAL: Reviews array is empty!`);
    }
    
    // Test creating a simple document in each collection
    console.log(`🧪 Testing collection access...`);
    try {
      const testReview = await databases.createDocument(
        config.databaseId!,
        config.reviewsCollectionId!,
        ID.unique(),
        {
          name: "Test Reviewer",
          avatar: "https://via.placeholder.com/100",
          review: "Test review",
          rating: 5,
        }
      );
      console.log(`✅ Test review created: ${testReview.$id}`);
      // Clean up test document
      await databases.deleteDocument(config.databaseId!, config.reviewsCollectionId!, testReview.$id);
    } catch (error) {
      console.error(`❌ Failed to create test review:`, error);
      console.error(`❌ Review collection might not exist or have wrong permissions`);
    }
    
    try {
      const testGallery = await databases.createDocument(
        config.databaseId!,
        config.galleriesCollectionId!,
        ID.unique(),
        { image: "https://via.placeholder.com/400" }
      );
      console.log(`✅ Test gallery created: ${testGallery.$id}`);
      // Clean up test document
      await databases.deleteDocument(config.databaseId!, config.galleriesCollectionId!, testGallery.$id);
    } catch (error) {
      console.error(`❌ Failed to create test gallery:`, error);
      console.error(`❌ Gallery collection might not exist or have wrong permissions`);
    }

    // Seed Properties - Create one property for each type to ensure all types are represented
    for (let i = 0; i < propertyTypes.length; i++) {
      try {
        const assignedAgent = agents[Math.floor(Math.random() * agents.length)];
        
        // Check if arrays have data before calling getRandomSubset
        if (reviews.length === 0) {
          console.log(`⚠️ Reviews array is empty!`);
        }
        if (galleries.length === 0) {
          console.log(`⚠️ Galleries array is empty!`);
        }
        
        let assignedReviews: any[] = [];
        let assignedGalleries: any[] = [];
        
        try {
          const minReviews = Math.min(5, reviews.length);
          const maxReviews = Math.min(7, reviews.length);
          assignedReviews = reviews.length > 0 ? getRandomSubset(reviews, minReviews, maxReviews) : []; // 5 to 7 reviews
        } catch (error) {
          console.error(`❌ Error getting random reviews subset:`, error);
          assignedReviews = [];
        }
        
        try {
          const minGalleries = Math.min(3, galleries.length);
          const maxGalleries = Math.min(8, galleries.length);
          assignedGalleries = galleries.length > 0 ? getRandomSubset(galleries, minGalleries, maxGalleries) : []; // 3 to 8 galleries
        } catch (error) {
          console.error(`❌ Error getting random galleries subset:`, error);
          assignedGalleries = [];
        }
        
        console.log(`📊 Reviews available: ${reviews.length}, assigned: ${assignedReviews.length}`);
        console.log(`📊 Galleries available: ${galleries.length}, assigned: ${assignedGalleries.length}`);
        console.log(`🔗 Assigned reviews IDs:`, assignedReviews.map(r => r.$id));
        console.log(`🔗 Assigned galleries IDs:`, assignedGalleries.map(g => g.$id));
        console.log(`🔍 Assigned reviews objects:`, assignedReviews);
        console.log(`🔍 Assigned galleries objects:`, assignedGalleries);

        const selectedFacilities = facilities
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * facilities.length) + 1);

        const image = propertiesImages[i % propertiesImages.length];

        console.log(`Creating ${propertyTypes[i]} property...`);
        console.log(`📝 Storing reviews:`, assignedReviews.map(r => r.$id));
        console.log(`📝 Storing galleries:`, assignedGalleries.map(g => g.$id));
        console.log(`📝 Reviews array length:`, assignedReviews.length);
        console.log(`📝 Galleries array length:`, assignedGalleries.length);
        console.log(`📝 Reviews array type:`, Array.isArray(assignedReviews) ? 'array' : 'not-array');
        console.log(`📝 Galleries array type:`, Array.isArray(assignedGalleries) ? 'array' : 'not-array');
        console.log(`📝 Reviews array isArray:`, Array.isArray(assignedReviews));
        console.log(`📝 Galleries array isArray:`, Array.isArray(assignedGalleries));

        let property;
        const propertyData = {
          name: `${propertyTypes[i]} Property ${i + 1}`,
          type: propertyTypes[i],
          description: `This is a beautiful ${propertyTypes[i]} property located in a prime area. Perfect for families and professionals.`,
          address: `123 ${propertyTypes[i]} Street, City ${i + 1}`,
          geolocation: `192.168.1.${i + 1}, 192.168.1.${i + 1}`,
          price: Math.floor(Math.random() * 9000) + 1000,
          area: Math.floor(Math.random() * 3000) + 500,
          bedrooms: Math.floor(Math.random() * 5) + 1,
          bathrooms: Math.floor(Math.random() * 5) + 1,
          rating: Math.floor(Math.random() * 5) + 1,
          facilities: selectedFacilities,
          image: image,
          agent: assignedAgent.$id,
          // Store review and gallery IDs directly
          reviews: assignedReviews.map((review) => review.$id),
          gallery: assignedGalleries.map((gallery) => gallery.$id),
        };
        
        console.log(`🔍 Property data to create:`, JSON.stringify(propertyData, null, 2));
        
        try {
          property = await databases.createDocument(
            config.databaseId!,
            COLLECTIONS.PROPERTY!,
            ID.unique(),
            propertyData
          );
          
          console.log(`✅ Successfully created ${propertyTypes[i]} property with ${assignedReviews.length} reviews and ${assignedGalleries.length} galleries`);
          console.log(`✅ Seeded property: ${property.name}`);
        } catch (propertyError) {
          console.error(`❌ Failed to create ${propertyTypes[i]} property:`, propertyError);
          console.error(`❌ Property creation error details:`, JSON.stringify(propertyError, null, 2));
          console.error(`❌ Assigned reviews:`, assignedReviews.map(r => r.$id));
          console.error(`❌ Assigned galleries:`, assignedGalleries.map(g => g.$id));
        }
      } catch (error) {
        console.error(`❌ Failed to create ${propertyTypes[i]} property:`, error);
        // Continue with next property type instead of failing completely
      }
    }
    
    // Then create additional random properties
    console.log(`🌱 Starting additional properties creation...`);
    console.log(`📊 Reviews array length before additional properties: ${reviews.length}`);
    console.log(`📊 Galleries array length before additional properties: ${galleries.length}`);
    
    for (let i = propertyTypes.length; i < 20; i++) {
      try {
      const assignedAgent = agents[Math.floor(Math.random() * agents.length)];

        let assignedReviews: any[] = [];
        let assignedGalleries: any[] = [];
        
        try {
          const minReviews = Math.min(5, reviews.length);
          const maxReviews = Math.min(7, reviews.length);
          console.log(`🔍 Debug: minReviews=${minReviews}, maxReviews=${maxReviews}, reviews.length=${reviews.length}`);
          assignedReviews = reviews.length > 0 ? getRandomSubset(reviews, minReviews, maxReviews) : []; // 5 to 7 reviews
          console.log(`📊 Additional property ${i + 1} - Reviews available: ${reviews.length}, assigned: ${assignedReviews.length}`);
        } catch (error) {
          console.error(`❌ Error getting random reviews subset:`, error);
          assignedReviews = [];
        }
        
        try {
          const minGalleries = Math.min(3, galleries.length);
          const maxGalleries = Math.min(8, galleries.length);
          console.log(`🔍 Debug: minGalleries=${minGalleries}, maxGalleries=${maxGalleries}, galleries.length=${galleries.length}`);
          assignedGalleries = galleries.length > 0 ? getRandomSubset(galleries, minGalleries, maxGalleries) : []; // 3 to 8 galleries
          console.log(`📊 Additional property ${i + 1} - Galleries available: ${galleries.length}, assigned: ${assignedGalleries.length}`);
        } catch (error) {
          console.error(`❌ Error getting random galleries subset:`, error);
          assignedGalleries = [];
        }

      const selectedFacilities = facilities
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * facilities.length) + 1);

      const image =
        propertiesImages.length - 1 >= i
          ? propertiesImages[i]
          : propertiesImages[
              Math.floor(Math.random() * propertiesImages.length)
            ];

        const randomType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
        
        console.log(`Creating additional property: ${randomType}`);
        console.log(`📝 Storing reviews:`, assignedReviews.map(r => r.$id));
        console.log(`📝 Storing galleries:`, assignedGalleries.map(g => g.$id));
        console.log(`📝 Reviews array length:`, assignedReviews.length);
        console.log(`📝 Galleries array length:`, assignedGalleries.length);

      const property = await databases.createDocument(
        config.databaseId!,
        COLLECTIONS.PROPERTY!,
        ID.unique(),
        {
            name: `Property ${i + 1}`,
            type: randomType,
            description: `This is a beautiful ${randomType} property located in a prime area. Perfect for families and professionals.`,
            address: `123 ${randomType} Street, City ${i + 1}`,
            geolocation: `192.168.1.${i + 1}, 192.168.1.${i + 1}`,
          price: Math.floor(Math.random() * 9000) + 1000,
          area: Math.floor(Math.random() * 3000) + 500,
          bedrooms: Math.floor(Math.random() * 5) + 1,
          bathrooms: Math.floor(Math.random() * 5) + 1,
          rating: Math.floor(Math.random() * 5) + 1,
          facilities: selectedFacilities,
          image: image,
          agent: assignedAgent.$id,
          reviews: assignedReviews.map((review) => review.$id),
          gallery: assignedGalleries.map((gallery) => gallery.$id),
        }
      );

        console.log(`✅ Successfully created ${randomType} property with ${assignedReviews.length} reviews and ${assignedGalleries.length} galleries`);
        console.log(`✅ Seeded property: ${property.name}`);
      } catch (error) {
        console.error(`❌ Failed to create additional property ${i + 1}:`, error);
        // Continue with next property instead of failing completely
      }
    }


    // Test the fix by fetching all properties and checking their structure
    console.log(`🧪 Testing the fix by fetching all properties...`);
    try {
      const allProperties = await databases.listDocuments(
        config.databaseId!,
        COLLECTIONS.PROPERTY!,
        []
      );
      
      console.log(`📊 Total properties in database: ${allProperties.documents.length}`);
      
      if (allProperties.documents.length > 0) {
        // Show all property IDs for debugging
        console.log(`📋 All property IDs:`, allProperties.documents.map(p => p.$id));
        
        const testProperty = allProperties.documents[0];
        console.log(`🧪 Test property structure:`, {
          id: testProperty.$id,
          name: testProperty.name,
          hasReviews: !!testProperty.reviews,
          reviewsLength: testProperty.reviews?.length || 0,
          hasGallery: !!testProperty.gallery,
          galleryLength: testProperty.gallery?.length || 0,
          reviewsType: Array.isArray(testProperty.reviews) ? 'array' : 'not-array',
          galleryType: Array.isArray(testProperty.gallery) ? 'array' : 'not-array'
        });
        
        if (testProperty.reviews && testProperty.gallery) {
          console.log(`✅ SUCCESS: Property now has reviews and gallery arrays!`);
        } else {
          console.log(`❌ ISSUE: Property still missing reviews or gallery arrays`);
        }
      } else {
        console.log(`❌ CRITICAL: No properties found in database!`);
      }
    } catch (testError) {
      console.error(`❌ Error testing property structure:`, testError);
    }

    console.log("Data seeding completed.");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

export default seed;