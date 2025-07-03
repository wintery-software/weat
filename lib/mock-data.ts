import type { Restaurant } from "@/types/restaurant";
import { faker } from "@faker-js/faker";

// Restaurant cuisine types for more realistic data
const CUISINE_TYPES = [
  "italian",
  "japanese",
  "chinese",
  "mexican",
  "indian",
  "thai",
  "french",
  "mediterranean",
  "american",
  "greek",
  "spanish",
  "vietnamese",
  "korean",
  "lebanese",
  "turkish",
  "moroccan",
  "brazilian",
  "peruvian",
  "ethiopian",
];

// Restaurant tags for different types (in Chinese)
const RESTAURANT_TAGS = {
  italian: ["意面", "披萨", "红酒", "正宗", "家庭经营"],
  japanese: ["寿司", "拉面", "新鲜海鲜", "正宗", "传统"],
  chinese: ["点心", "川菜", "粤菜", "正宗", "家庭式"],
  mexican: ["墨西哥卷饼", "街头美食", "正宗", "辣味", "休闲"],
  indian: ["咖喱", "烤饼", "正宗", "辣味", "素食友好"],
  thai: ["泰式炒河粉", "咖喱", "正宗", "辣味", "新鲜食材"],
  french: ["小酒馆", "红酒", "浪漫", "经典", "优雅"],
  mediterranean: ["健康", "新鲜", "橄榄油", "烧烤", "素食友好"],
  american: ["舒适美食", "汉堡", "休闲", "家庭友好", "经典"],
  greek: ["地中海", "橄榄油", "正宗", "健康", "烧烤"],
};

// Taste aspects for different cuisines (in Chinese)
const TASTE_ASPECTS = {
  italian: ["新鲜意面", "浓郁酱汁", "正宗风味", "完美调味"],
  japanese: ["新鲜海鲜", "完美米饭", "正宗风味", "鲜味丰富"],
  chinese: ["浓郁风味", "正宗香料", "新鲜食材", "复杂口感"],
  mexican: ["浓郁风味", "新鲜食材", "正宗香料", "完美辣度"],
  indian: ["丰富香料", "复杂风味", "正宗配方", "完美平衡"],
  thai: ["新鲜香草", "平衡风味", "正宗香料", "完美辣度"],
  french: ["经典技法", "浓郁风味", "完美呈现", "优雅口感"],
  mediterranean: ["新鲜食材", "清淡风味", "健康选择", "橄榄油基底"],
  american: ["舒适风味", "丰盛分量", "经典口感", "家庭友好"],
  greek: ["新鲜食材", "地中海风味", "橄榄油基底", "正宗口感"],
};

// Service aspects (in Chinese)
const SERVICE_ASPECTS = [
  "周到服务",
  "友好态度",
  "快速服务",
  "专业员工",
  "热情好客",
  "专业服务",
  "高效服务",
  "乐于助人",
  "家庭氛围",
  "浪漫氛围",
  "休闲服务",
  "专业推荐",
];

// Environment aspects (in Chinese)
const ENVIRONMENT_ASPECTS = [
  "温馨氛围",
  "优雅装饰",
  "私密环境",
  "休闲氛围",
  "精美摆盘",
  "整洁空间",
  "传统装饰",
  "现代氛围",
  "乡村魅力",
  "精致环境",
  "家庭友好",
  "浪漫氛围",
];

// Chinese cuisine names for headlines
const CUISINE_NAMES = {
  italian: "意大利",
  japanese: "日本",
  chinese: "中式",
  mexican: "墨西哥",
  indian: "印度",
  thai: "泰式",
  french: "法式",
  mediterranean: "地中海",
  american: "美式",
  greek: "希腊",
};

// Cache for consistent UUIDs based on input
const uuidCache = new Map<string, string>();

/**
 * Generates a consistent UUID for a given input
 */
const getConsistentUuid = (input: string): string => {
  if (uuidCache.has(input)) {
    return uuidCache.get(input)!;
  }

  // Generate a UUID based on the input string for consistency
  const uuid = faker.string.uuid();
  uuidCache.set(input, uuid);

  return uuid;
};

/**
 * Generates a random cuisine type
 */
const getRandomCuisine = (): string => {
  return faker.helpers.arrayElement(CUISINE_TYPES);
};

/**
 * Generates restaurant tags based on cuisine
 */
const generateTags = (cuisine: string): string[] => {
  const baseTags = RESTAURANT_TAGS[cuisine as keyof typeof RESTAURANT_TAGS] || [
    "正宗",
    "美味",
  ];
  const additionalTags = faker.helpers.arrayElements(
    [
      "新鲜食材",
      "本地采购",
      "有机",
      "可持续",
      "获奖餐厅",
      "主厨推荐",
      "农场直供",
      "时令",
      "手工制作",
      "匠心独运",
    ],
    { min: 1, max: 3 },
  );

  // Combine tags and remove duplicates using Set
  const allTags = [...baseTags, ...additionalTags];

  return [...new Set(allTags)];
};

/**
 * Generates taste aspects based on cuisine
 */
const generateTasteAspects = (cuisine: string): string[] => {
  const baseAspects = TASTE_ASPECTS[cuisine as keyof typeof TASTE_ASPECTS] || [
    "美味风味",
    "新鲜食材",
  ];

  return faker.helpers.arrayElements(baseAspects, { min: 2, max: 4 });
};

/**
 * Generates a restaurant summary
 */
const generateSummary = (cuisine: string) => {
  const cuisineName =
    CUISINE_NAMES[cuisine as keyof typeof CUISINE_NAMES] || cuisine;
  const headlines = [
    `卓越的${cuisineName}美食，正宗风味`,
    `美味的${cuisineName}用餐体验`,
    `正宗的${cuisineName}餐厅，新鲜食材`,
    `出色的${cuisineName}美食，温馨氛围`,
    `优质的${cuisineName}用餐，优质服务`,
  ];

  return {
    headline: faker.helpers.arrayElement(headlines),
    sentimentScore: faker.number.float({
      min: 3.5,
      max: 5.0,
      fractionDigits: 1,
    }),
    aspects: {
      taste: generateTasteAspects(cuisine),
      service: faker.helpers.arrayElements(SERVICE_ASPECTS, { min: 2, max: 4 }),
      environment: faker.helpers.arrayElements(ENVIRONMENT_ASPECTS, {
        min: 2,
        max: 4,
      }),
    },
    keywords: generateTags(cuisine),
  };
};

/**
 * Generates a single mock restaurant
 */
export const generateMockRestaurant = (id?: string): Restaurant => {
  const cuisine = getRandomCuisine();
  const city = faker.location.city();
  const state = faker.location.state();

  return {
    id: id || faker.string.uuid(),
    name: faker.company.name(),
    address: {
      address1: faker.location.streetAddress(),
      address2: faker.datatype.boolean({ probability: 0.3 })
        ? faker.location.secondaryAddress()
        : null,
      city,
      state,
      zipcode: faker.location.zipCode(),
    },
    location: {
      lat: faker.location.latitude(),
      lng: faker.location.longitude(),
    },
    tags: generateTags(cuisine),
    summary: generateSummary(cuisine),
    externalLinks: {
      website: faker.datatype.boolean({ probability: 0.8 })
        ? faker.internet.url()
        : undefined,
      googleMaps: faker.datatype.boolean({ probability: 0.9 })
        ? `https://maps.google.com/?q=${encodeURIComponent(`${faker.company.name()} ${city} ${state}`)}`
        : undefined,
    },
  };
};

/**
 * Generates multiple mock restaurants
 */
export const generateMockRestaurants = (count: number = 10): Restaurant[] => {
  return Array.from({ length: count }, () => generateMockRestaurant());
};

/**
 * Generates mock restaurants data in the same format as the JSON file
 */
export const generateMockRestaurantsData = (count: number = 10) => {
  return {
    restaurants: generateMockRestaurants(count),
  };
};

/**
 * Generates a restaurant with a specific ID for consistent data
 */
export const generateMockRestaurantById = (id: string): Restaurant => {
  const cuisine = getRandomCuisine();
  const city = faker.location.city();
  const state = faker.location.state();

  return {
    id: getConsistentUuid(id), // Use consistent UUID based on input
    name: faker.company.name(),
    address: {
      address1: faker.location.streetAddress(),
      address2: faker.datatype.boolean({ probability: 0.3 })
        ? faker.location.secondaryAddress()
        : null,
      city,
      state,
      zipcode: faker.location.zipCode(),
    },
    location: {
      lat: faker.location.latitude(),
      lng: faker.location.longitude(),
    },
    tags: generateTags(cuisine),
    summary: generateSummary(cuisine),
    externalLinks: {
      website: faker.datatype.boolean({ probability: 0.8 })
        ? faker.internet.url()
        : undefined,
      googleMaps: faker.datatype.boolean({ probability: 0.9 })
        ? `https://maps.google.com/?q=${encodeURIComponent(`${faker.company.name()} ${city} ${state}`)}`
        : undefined,
    },
  };
};
