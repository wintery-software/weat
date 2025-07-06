/**
 * AI utility functions for generating and streaming text content
 */

import { faker } from "@faker-js/faker/locale/zh_CN";

// Chinese restaurant-related content for faker
const CHINESE_DISHES = [
  "麻婆豆腐",
  "宫保鸡丁",
  "回锅肉",
  "糖醋里脊",
  "水煮鱼",
  "辣子鸡",
  "红烧肉",
  "清蒸鲈鱼",
  "蒜蓉炒青菜",
  "酸菜鱼",
  "小笼包",
  "炒面",
  "蛋炒饭",
  "红烧狮子头",
  "白切鸡",
  "叉烧肉",
  "烧鹅",
  "烤鸭",
];

const RESTAURANT_AMENITIES = [
  "包厢预订",
  "外卖配送",
  "停车位",
  "WiFi",
  "空调",
  "电视",
  "儿童座椅",
  "无障碍设施",
  "信用卡支付",
  "支付宝",
  "微信支付",
];

const RESTAURANT_ATMOSPHERES = [
  "温馨",
  "典雅",
  "现代",
  "传统",
  "豪华",
  "简约",
  "家庭式",
  "商务",
];

/**
 * Generate random restaurant-focused markdown content
 * @param restaurantName Name of the restaurant
 * @param tags Array of restaurant tags
 * @param rating Restaurant rating
 * @returns Generated markdown text
 */
export const generateRestaurantInsights = (
  restaurantName: string,
  tags: string[] = [],
  rating: number = 4.5,
): string => {
  const paragraphs: string[] = [];

  // Generate header
  paragraphs.push(
    `## 餐厅分析总结\n\n${restaurantName}在顾客中享有${rating >= 4.5 ? "很高的声誉" : rating >= 4.0 ? "良好的口碑" : "一般的评价"}，`,
  );

  // Generate main description
  const mainFeatures =
    tags.length > 0
      ? tags.slice(0, 3)
      : ["正宗的中式料理", "温馨的用餐环境", "优质的服务"];
  paragraphs.push(`主要以其**${mainFeatures.join("**、**")}**而闻名。`);

  // Generate customer highlights
  paragraphs.push(`\n### 顾客推荐亮点\n\n`);
  const highlightCount = faker.number.int({ min: 3, max: 5 });
  const highlights = [];

  for (let i = 0; i < highlightCount; i++) {
    const dish = faker.helpers.arrayElement(CHINESE_DISHES);
    highlights.push(
      `- **${faker.helpers.arrayElement(["招牌菜品", "特色美食", "人气推荐"])}**：${dish}`,
    );
  }

  highlights.push(
    `- **服务质量**：${faker.helpers.arrayElement(["服务员态度友好", "服务周到细致", "上菜速度适中"])}`,
  );
  highlights.push(
    `- **环境氛围**：${faker.helpers.arrayElement(RESTAURANT_ATMOSPHERES)}装修，适合${faker.helpers.arrayElement(["家庭聚餐", "商务宴请", "朋友聚会", "情侣约会"])}`,
  );

  paragraphs.push(highlights.join("\n"));

  // Generate pricing section
  const priceRange = faker.helpers.arrayElement([
    "50-80元",
    "80-120元",
    "120-200元",
    "200-300元",
  ]);
  paragraphs.push(
    `\n### 价格定位\n\n餐厅定价${faker.helpers.arrayElement(["合理", "适中", "偏高", "经济实惠"])}, 人均消费在**${priceRange}**之间，`,
  );
  paragraphs.push(
    `性价比较${rating >= 4.0 ? "高" : "一般"}，适合${faker.helpers.arrayElement(["大众消费", "中高端消费", "商务消费"])}。`,
  );
  paragraphs.push(
    `菜品分量${faker.helpers.arrayElement(["足够", "充足", "适中"])}, 口味${faker.helpers.arrayElement(["地道", "正宗", "美味"])}。\n\n`,
  );

  // Generate services section
  paragraphs.push(`### 特色服务\n\n`);
  const serviceCount = faker.number.int({ min: 3, max: 6 });
  const services = faker.helpers.arrayElements(
    RESTAURANT_AMENITIES,
    serviceCount,
  );
  const serviceList = services
    .map((service) => `- ${service}：支持`)
    .join("\n");
  paragraphs.push(serviceList);

  // Generate overall evaluation
  paragraphs.push(`\n### 总体评价\n\n`);

  let evaluation = "";

  if (rating >= 4.5) {
    evaluation = `这是一家${faker.helpers.arrayElement(["非常值得推荐", "强烈推荐", "绝对值得一试"])}的${faker.helpers.arrayElement(["中式餐厅", "中餐店", "中国菜馆"])}，`;
  } else if (rating >= 4.0) {
    evaluation = `这是一家${faker.helpers.arrayElement(["值得推荐", "不错的选择", "可以考虑"])}的${faker.helpers.arrayElement(["中式餐厅", "中餐店", "中国菜馆"])}，`;
  } else {
    evaluation = `这是一家${faker.helpers.arrayElement(["有待改进", "需要提升", "一般般"])}的${faker.helpers.arrayElement(["中式餐厅", "中餐店", "中国菜馆"])}，`;
  }

  paragraphs.push(evaluation);
  paragraphs.push(
    `无论是菜品质量还是服务水平都达到了${rating >= 4.5 ? "**优秀标准**" : rating >= 4.0 ? "较高标准" : "一般标准"}。`,
  );

  const specialNote = faker.helpers.arrayElement([
    "特别适合想要品尝正宗中式料理的顾客。",
    "非常适合家庭聚餐和商务宴请。",
    "是品尝地道中餐的好去处。",
    "值得一试的中式美食体验。",
  ]);
  paragraphs.push(specialNote);

  paragraphs.push(
    `建议${faker.helpers.arrayElement(["提前预订", "错峰用餐", "避开高峰期"])}，尤其是${faker.helpers.arrayElement(["周末和节假日", "晚餐时段", "午餐时段"])}。`,
  );

  return paragraphs.join("");
};

/**
 * Generate AI insights for a restaurant by ID
 * @param restaurantId The restaurant ID to generate insights for
 * @returns AI-generated insights text
 */
export const generateRestaurantInsightsById = async (
  restaurantId: string,
): Promise<string> => {
  // Import database and schema here to avoid circular dependencies
  const { db } = await import("@/db");
  const { restaurants, restaurantSummaries, restaurantsTags, tags } =
    await import("@/db/schema");
  const { eq } = await import("drizzle-orm");

  try {
    // Fetch restaurant data
    const restaurant = await db
      .select()
      .from(restaurants)
      .where(eq(restaurants.id, restaurantId))
      .limit(1);

    if (!restaurant || restaurant.length === 0) {
      throw new Error("Restaurant not found");
    }

    const restaurantData = restaurant[0];

    // Fetch restaurant summary if available
    const summary = await db
      .select()
      .from(restaurantSummaries)
      .where(eq(restaurantSummaries.restaurantId, restaurantId))
      .limit(1);

    // Fetch restaurant tags
    const restaurantTags = await db
      .select({
        tagName: tags.name,
        reviewCount: restaurantsTags.reviewCount,
      })
      .from(restaurantsTags)
      .innerJoin(tags, eq(restaurantsTags.tagId, tags.id))
      .where(eq(restaurantsTags.restaurantId, restaurantId))
      .orderBy(restaurantsTags.reviewCount)
      .limit(5);

    const restaurantName =
      restaurantData.nameZh || restaurantData.nameEn || "这家餐厅";
    const tagNames = restaurantTags.map((rt) => rt.tagName);
    const averageRating = summary[0]?.averageRating || 4.5;

    return generateRestaurantInsights(
      restaurantName,
      tagNames,
      Number(averageRating),
    );
  } catch (error) {
    console.error("Error generating insights for restaurant:", error);

    // Fallback to default insights
    return generateRestaurantInsights("这家餐厅", [], 4.5);
  }
};

/**
 * Chunk text into tokens for streaming simulation
 * @param text The text to chunk
 * @param chunkSize Size of each chunk (default: 3-8 characters)
 * @returns Array of text chunks
 */
export const chunkTextIntoTokens = (
  text: string,
  chunkSize?: number,
): string[] => {
  const chunks: string[] = [];
  let currentIndex = 0;

  while (currentIndex < text.length) {
    // Variable chunk size for more natural streaming
    const dynamicChunkSize = chunkSize || Math.floor(Math.random() * 6) + 3; // 3-8 characters
    const chunk = text.slice(currentIndex, currentIndex + dynamicChunkSize);
    chunks.push(chunk);
    currentIndex += dynamicChunkSize;
  }

  return chunks;
};
