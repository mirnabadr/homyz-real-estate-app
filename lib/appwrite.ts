import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";
import {
  Account,
  Avatars,
  Client,
  Databases,
  Models,
  OAuthProvider,
  Query,
  Storage
} from "react-native-appwrite";

// Define interfaces for type safety
interface PropertyDocument extends Models.Document {
  name: string;
  type: string;
  description: string;
  address: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  rating: number;
  facilities: string[];
  image: string;
  geolocation: string;
  agent: string | AgentDocument;
  reviews: string[] | ReviewDocument[];
  gallery: string[] | GalleryDocument[];
}

interface AgentDocument extends Models.Document {
  name: string;
  email: string;
  avatar: string;
}

interface ReviewDocument extends Models.Document {
  name: string;
  avatar: string;
  review: string;
  rating: number;
}

interface GalleryDocument extends Models.Document {
  image: string;
}

export const config = {
  platform: "com.jsm.restate",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  galleriesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID,
  reviewsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID,
  agentsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID,
  propertiesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID,
  bucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID,
};

export const client = new Client();
client
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform!);

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export async function login() {
  try {
    const redirectUri = Linking.createURL("/");

    const response = await account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUri
    );
    if (!response) throw new Error("Create OAuth2 token failed");

    const browserResult = await openAuthSessionAsync(
      response.toString(),
      redirectUri
    );
    if (browserResult.type !== "success")
      throw new Error("Create OAuth2 token failed");

    const url = new URL(browserResult.url);
    const secret = url.searchParams.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();
    if (!secret || !userId) throw new Error("Create OAuth2 token failed");

    const session = await account.createSession(userId, secret);
    if (!session) throw new Error("Failed to create session");

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function logout() {
  try {
    const result = await account.deleteSession("current");
    return result;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getCurrentUser() {
  try {
    const result = await account.get();
    if (result.$id) {
      // Generate avatar URL using ui-avatars.com
      const userName = result.name || result.email || 'User';
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=FFF8DC&color=8B4513&size=200&bold=true&format=png`;

      return {
        ...result,
        avatar: avatarUrl,
      };
    }

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getLatestProperties() {
  try {
    console.log('🔍 getLatestProperties called');
    
    const result = await databases.listDocuments(
      config.databaseId!,
      config.propertiesCollectionId!,
      [Query.orderDesc("$createdAt"), Query.limit(5)]
    );

    console.log('🔍 getLatestProperties result:', { count: result.documents.length, documents: result.documents.map(d => ({ id: d.$id, name: d.name, type: d.type })) });

    return result.documents;
  } catch (error) {
    console.error('❌ getLatestProperties error:', error);
    return [];
  }
}

export async function getProperties({
  filter,
  query,
  limit,
}: {
  filter: string;
  query: string;
  limit?: number;
}) {
  try {
    console.log('🔍 getProperties called with:', { filter, query, limit });
    
    const buildQuery = [Query.orderDesc("$createdAt")];

    if (filter && filter !== "All")
      buildQuery.push(Query.equal("type", filter));

    if (query)
      buildQuery.push(
        Query.or([
          Query.search("name", query),
          Query.search("address", query),
          Query.search("type", query),
        ])
      );

    if (limit) buildQuery.push(Query.limit(limit));

    console.log('🔍 Query built:', buildQuery);

    const result = await databases.listDocuments(
      config.databaseId!,
      config.propertiesCollectionId!,
      buildQuery
    );

    console.log('🔍 Query result:', { count: result.documents.length, documents: result.documents.map(d => ({ id: d.$id, name: d.name, type: d.type })) });

    return result.documents;
  } catch (error) {
    console.error('❌ getProperties error:', error);
    return [];
  }
}

// Get property by id with resilient relationship fetching and simple retry
export const getPropertyById = async ({ id, retries = 3 }: { id: string; retries?: number }): Promise<any> => {
  try {
    console.log(`🔍 Fetching property: ${id}`);
    
    // Fetch property with relationship data
    const property = await databases.getDocument(
      config.databaseId!,
      config.propertiesCollectionId!,
      id
    );
    // Normalize and fetch agent if it's an ID
    let agentData = property.agent;
    if (agentData && typeof agentData === 'string') {
      try {
        agentData = await databases.getDocument(
          config.databaseId!,
          config.agentsCollectionId!,
          String(property.agent)
        );
      } catch (agentErr) {
        console.log('⚠️ Agent fetch failed:', agentErr instanceof Error ? agentErr.message : String(agentErr));
      }
    }

    // Using relationship queries instead of stored IDs

    // Fetch related docs - try relations first, fallback to stored IDs
    const [reviewsDocs, galleryDocs] = await Promise.all([
      (async () => {
        try {
          // Try relation query first
          const r = await databases.listDocuments(
            config.databaseId!,
            config.reviewsCollectionId!,
            [Query.equal('property', id), Query.limit(10)]
          );
          return r.documents as any[];
        } catch (error) {
          console.log('⚠️ Reviews relation query failed, trying stored IDs...');
          // Fallback: check if property has review IDs stored
          if (property.reviews && Array.isArray(property.reviews)) {
            try {
              const reviewPromises = property.reviews.map((reviewId: string) =>
                databases.getDocument(config.databaseId!, config.reviewsCollectionId!, reviewId)
              );
              const reviews = await Promise.all(reviewPromises);
              return reviews as any[];
            } catch (reviewError) {
              console.log('⚠️ Review ID fetch failed:', reviewError);
            }
          }
          // Final fallback: generate reviews dynamically with gender-appropriate avatars
          return [
            {
              $id: 'review1',
              name: 'Charlotte Hanlin',
              avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b6c8?w=400',
              review: "The apartment is very clean and modern. I really like the interior design. Looks like I'll feel at home 😍",
              rating: 5
            },
            {
              $id: 'review2', 
              name: 'Michael Chen',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
              review: 'Outstanding property with great investment potential and beautiful location.',
              rating: 4
            },
            {
              $id: 'review3',
              name: 'Emily Rodriguez', 
              avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
              review: 'Perfect for families. Love the modern amenities and spacious rooms.',
              rating: 5
            }
          ] as any[];
        }
      })(),
      (async () => {
        try {
          // Try relation query first
          const g = await databases.listDocuments(
            config.databaseId!,
            config.galleriesCollectionId!,
            [Query.equal('property', id), Query.limit(20)]
          );
          return g.documents as any[];
        } catch (error) {
          console.log('⚠️ Galleries relation query failed, trying stored IDs...');
          // Fallback: check if property has gallery IDs stored
          if (property.gallery && Array.isArray(property.gallery)) {
            try {
              const galleryPromises = property.gallery.map((galleryId: string) =>
                databases.getDocument(config.databaseId!, config.galleriesCollectionId!, galleryId)
              );
              const galleries = await Promise.all(galleryPromises);
              return galleries as any[];
            } catch (galleryError) {
              console.log('⚠️ Gallery ID fetch failed:', galleryError);
            }
          }
          // Final fallback: generate gallery dynamically
          const propertyType = property.type || 'House';
          const fallbackImages = {
            House: [
              'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1591825729269-caeb344f6df2?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop'
            ],
            Condo: [
              'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop'
            ],
            Villa: [
              'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop'
            ],
            Apartment: [
              'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop'
            ],
            Townhouse: [
              'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop'
            ],
            Duplex: [
              'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop'
            ],
            Studio: [
              'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop'
            ],
            Others: [
              'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop'
            ]
          };
          const images = fallbackImages[propertyType as keyof typeof fallbackImages] || fallbackImages.House;
          return images.map((image, index) => ({
            $id: `gallery_${index}`,
            image: image
          })) as any[];
        }
      })(),
    ]);

    const result = {
      ...property,
      agent: agentData ?? property.agent,
      reviews: reviewsDocs,
      gallery: galleryDocs,
    } as any;

    console.log(
      `✅ Property loaded: ${result.reviews?.length || 0} reviews, ${result.gallery?.length || 0} gallery images`
    );
    return result;
    
  } catch (error) {
    console.error(`❌ Property fetch failed:`, error);
    if (retries && retries > 1) {
      const attempt = 4 - retries;
      const backoffMs = (attempt + 1) * 1500;
      console.log(`⏳ Retrying in ${backoffMs}ms... (attempt ${attempt + 2}/3)`);
      await new Promise((r) => setTimeout(r, backoffMs));
      return getPropertyById({ id, retries: retries - 1 });
    }
    throw error;
  }
};

export async function loginAlternative() {
  try {
    // Alternative login method - you can implement this as needed
    console.log('Alternative login method called');
    return false; // Placeholder - implement your alternative login logic
  } catch (error) {
    console.error('Alternative login error:', error);
    return false;
  }
}

export async function testConnection() {
  try {
    // Test Appwrite connection by trying to get current user
    const user = await getCurrentUser();
    return user !== null;
  } catch (error) {
    console.error('Connection test error:', error);
    return false;
  }
}