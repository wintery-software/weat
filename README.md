# Weat

## Getting Started

Install packages:

```shell
yarn install
```

### Services

#### Database

The database is managed by Prisma + PostgreSQL.

Set up the following environment variables:

```shell
DATABASE_URL=<url>
```

#### AWS S3

AWS S3 is used to store images.

Set up the following environment variables:

```shell
AWS_ACCESS_KEY_ID=<access_key_id>
AWS_SECRET_ACCESS_KEY=<secret_access_key>
AWS_REGION=<region>
AWS_BUCKET=<bucket>
```

#### Google Maps API

The Google Maps API is used to get place details, the distance between two locations, etc.

Set up the following environment variables:

> Google Maps API can be turned on or off.
> To enable Google Maps API, the value of
> `NEXT_PUBLIC_GOOGLE_MAPS_API_ENABLED` must be `true` (case-sensitive).

```shell
GOOGLE_MAPS_API_KEY=<api_key>
NEXT_PUBLIC_GOOGLE_MAPS_API_ENABLED=<true_or_false>
```

#### Redis (Optional)

Redis is used to cache distance matrix data from Google Maps API. If you don't want to enable this feature, you can skip this step.

Set up the following environment variables:

```shell
REDIS_URL=<url>
```

### Run

Run the development server:

```shell
yarn dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Deployment

The project is currently deployed on Vercel
([weat - Overview - Vercel](https://vercel.com/wintery-software/weat))
using [`master`](https://github.com/wintery-software/weat/tree/master) branch.

Previous deployments:

- [Deployments · wintery-software/weat](https://github.com/wintery-software/weat/deployments)
- [weat – Deployments – Vercel](https://vercel.com/wintery-software/weat/deployments)

## Maintenance

### Cron

To run scripts in `prisma/crons`:

```shell
tsx prisma/crons/<script>.ts
```
