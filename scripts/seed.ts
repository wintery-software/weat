import { db } from "@/db";
import {
  addresses,
  restaurantDishes,
  restaurants,
  restaurantsTags,
  restaurantSummaries,
  reviews,
  reviewSummaries,
  tags,
} from "@/db/schema";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

// --- Mock Data Generators ---

// Tag names for restaurants (in Chinese)
const TAG_NAMES = [
  "川菜",
  "粤菜",
  "火锅",
  "烧烤",
  "面食",
  "甜品",
  "小吃",
  "素食",
  "快餐",
  "海鲜",
  "家常菜",
  "酒吧",
  "咖啡馆",
  "早餐",
  "夜宵",
];

// Generate mock address
const generateMockAddress = () => {
  return {
    id: uuidv4(),
    address1: faker.location.streetAddress(),
    address2: faker.datatype.boolean({ probability: 0.3 })
      ? faker.location.secondaryAddress()
      : null,
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    zipCode: faker.location.zipCode("#####"),
  };
};

// Generate unique tags
const generateUniqueTags = (count: number) => {
  // Shuffle the tag names and take the first 'count' elements
  const shuffledNames = faker.helpers.shuffle([...TAG_NAMES]);
  const selectedNames = shuffledNames.slice(0, count);

  return selectedNames.map((name) => ({
    id: uuidv4(),
    name,
  }));
};

// Generate mock restaurant summary
const generateMockRestaurantSummary = (restaurantId: string) => {
  return {
    id: uuidv4(),
    restaurantId,
    summary: faker.lorem.sentences(2),
    topTags: faker.helpers
      .arrayElements(TAG_NAMES, { min: 2, max: 5 })
      .map((tag) => ({ tag, count: faker.number.int({ min: 1, max: 50 }) })),
    averageRating: faker.number
      .float({
        min: 3.5,
        max: 5.0,
        fractionDigits: 1,
      })
      .toString(), // Convert to string for numeric field
    updatedAt: faker.date.recent(),
  };
};

// Generate mock restaurant dish
const generateMockRestaurantDish = (
  restaurantId: string,
  dishNames: Set<string>,
) => {
  let dishName;

  do {
    dishName = faker.commerce.productName();
  } while (dishNames.has(dishName));

  dishNames.add(dishName);

  return {
    id: uuidv4(),
    restaurantId,
    name: dishName,
    mentionCount: faker.number.int({ min: 1, max: 50 }),
  };
};

// Generate mock restaurant
const generateMockRestaurant = (addressId: string) => {
  return {
    id: uuidv4(),
    nameZh: faker.company.name(),
    nameEn: faker.company.name(),
    addressId,
    latitude: Number(faker.location.latitude()),
    longitude: Number(faker.location.longitude()),
    phoneNumber: faker.string.numeric(10),
    googleMapsPlaceId: faker.string.alphanumeric(100),
    externalLinks: {
      website: faker.internet.url(),
      googleMaps: `https://maps.google.com/?q=${encodeURIComponent(faker.company.name())}`,
    },
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };
};

// Generate mock restaurant-tag junction
const generateMockRestaurantTag = (restaurantId: string, tagId: string) => {
  return {
    id: uuidv4(),
    restaurantId,
    tagId,
    reviewCount: faker.number.int({ min: 1, max: 100 }),
  };
};

// Generate mock review
const generateMockReview = (restaurantId: string) => {
  return {
    id: uuidv4(),
    restaurantId,
    source: faker.helpers.arrayElement(["google", "yelp", "tripadvisor"]),
    sourceId: faker.string.alphanumeric(20),
    publishedAt: faker.date.past({ years: 2 }),
    createdAt: faker.date.recent(),
  };
};

// Generate mock review summary
const generateMockReviewSummary = (reviewId: string) => {
  return {
    id: uuidv4(),
    reviewId,
    summary: faker.lorem.sentences(1),
    tags: faker.helpers.arrayElements(TAG_NAMES, { min: 1, max: 3 }),
    dishes: faker.helpers.arrayElements(
      [
        "Kung Pao Chicken",
        "Mapo Tofu",
        "Sweet and Sour Pork",
        "Dim Sum",
        "Hot Pot",
      ],
      { min: 1, max: 2 },
    ),
    rating: faker.number
      .float({
        min: 1.0,
        max: 5.0,
        fractionDigits: 1,
      })
      .toString(),
    authenticityScore: faker.number
      .float({
        min: 0.0,
        max: 1.0,
        fractionDigits: 2,
      })
      .toString(),
    createdAt: faker.date.recent(),
  };
};

// Generate full mock dataset
const generateFullMockData = (restaurantCount = 20, tagCount = 15) => {
  // Addresses
  const addresses = Array.from(
    { length: restaurantCount },
    generateMockAddress,
  );

  // Tags - ensure unique names
  const tags = generateUniqueTags(Math.min(tagCount, TAG_NAMES.length));

  // Restaurants
  const restaurants = addresses.map((address) => {
    return generateMockRestaurant(address.id);
  });

  // Summaries
  const summaries = restaurants.map((r) => generateMockRestaurantSummary(r.id));

  // Dishes
  const dishes = restaurants.flatMap((r) => {
    const dishNames = new Set<string>();

    return Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () =>
      generateMockRestaurantDish(r.id, dishNames),
    );
  });

  // Restaurant-Tag junctions
  const restaurantTags = restaurants.flatMap((r) =>
    faker.helpers
      .arrayElements(tags, { min: 2, max: 5 })
      .map((tag) => generateMockRestaurantTag(r.id, tag.id)),
  );

  // Reviews
  const reviews = restaurants.flatMap((r) =>
    Array.from({ length: faker.number.int({ min: 5, max: 25 }) }, () =>
      generateMockReview(r.id),
    ),
  );

  // Review summaries
  const reviewSummaries = reviews.map((review) =>
    generateMockReviewSummary(review.id),
  );

  return {
    addresses,
    tags,
    restaurants,
    summaries,
    dishes,
    restaurantTags,
    reviews,
    reviewSummaries,
  };
};

// --- Seed Function ---
const seed = async () => {
  console.log("Seeding database...");

  try {
    // Clear existing data (in reverse order of dependencies)
    console.log("Clearing existing data...");
    // eslint-disable-next-line drizzle/enforce-delete-with-where
    await db.delete(reviewSummaries).execute();
    // eslint-disable-next-line drizzle/enforce-delete-with-where
    await db.delete(restaurantsTags).execute();
    // eslint-disable-next-line drizzle/enforce-delete-with-where
    await db.delete(restaurantDishes).execute();
    // eslint-disable-next-line drizzle/enforce-delete-with-where
    await db.delete(restaurantSummaries).execute();
    // eslint-disable-next-line drizzle/enforce-delete-with-where
    await db.delete(reviews).execute();
    // eslint-disable-next-line drizzle/enforce-delete-with-where
    await db.delete(restaurants).execute();
    // eslint-disable-next-line drizzle/enforce-delete-with-where
    await db.delete(tags).execute();
    // eslint-disable-next-line drizzle/enforce-delete-with-where
    await db.delete(addresses).execute();

    // Generate mock data
    const mockData = generateFullMockData(20, 15); // 20 restaurants, 15 tags

    console.log("Inserting addresses...");
    await db.insert(addresses).values(mockData.addresses);

    console.log("Inserting tags...");
    await db.insert(tags).values(mockData.tags);

    console.log("Inserting restaurants...");
    await db.insert(restaurants).values(mockData.restaurants);

    console.log("Inserting restaurant summaries...");
    await db.insert(restaurantSummaries).values(mockData.summaries);

    console.log("Inserting restaurant dishes...");
    await db.insert(restaurantDishes).values(mockData.dishes);

    console.log("Inserting restaurant-tag relationships...");
    await db.insert(restaurantsTags).values(mockData.restaurantTags);

    console.log("Inserting reviews...");
    await db.insert(reviews).values(mockData.reviews);

    console.log("Inserting review summaries...");
    await db.insert(reviewSummaries).values(mockData.reviewSummaries);

    console.log("Database seeded successfully!");
    console.log(`Created:`);
    console.log(`   - ${mockData.addresses.length} addresses`);
    console.log(`   - ${mockData.tags.length} tags`);
    console.log(`   - ${mockData.restaurants.length} restaurants`);
    console.log(`   - ${mockData.summaries.length} summaries`);
    console.log(`   - ${mockData.dishes.length} dishes`);
    console.log(
      `   - ${mockData.restaurantTags.length} restaurant-tag relationships`,
    );
    console.log(`   - ${mockData.reviews.length} reviews`);
    console.log(`   - ${mockData.reviewSummaries.length} review summaries`);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seed function
seed()
  .then(() => {
    console.log("Seeding completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
