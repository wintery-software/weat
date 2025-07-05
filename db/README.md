# Database Schema

This directory contains the database schema for the Weat application, built with Drizzle ORM and PostgreSQL.

## Usage

### Database Commands

```bash
# Generate migrations
pnpm db:generate

# Apply migrations
pnpm db:migrate

# Push schema changes (development)
pnpm db:push

# Open Drizzle Studio
pnpm db:studio
```

### Environment Variables

Set `DATABASE_URL` in your environment:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/weat
```

### Example Queries

```typescript
import { db } from "@/db";
import { restaurants, reviews, tags } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// Get restaurant with address and tags
const restaurant = await db.query.restaurants.findFirst({
  where: eq(restaurants.id, restaurantId),
  with: {
    address: true,
    tags: {
      with: {
        tag: true,
      },
    },
  },
});

// Get reviews for a restaurant
const restaurantReviews = await db
  .select()
  .from(reviews)
  .where(eq(reviews.restaurantId, restaurantId))
  .orderBy(desc(reviews.publishedAt));
```
