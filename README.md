# Weat

## Statistics

![Alt](https://repobeats.axiom.co/api/embed/6b790c8e855beb6a78c66f2b1648fb356ca3d4ad.svg "Repobeats analytics image")

## Getting Started

Install dependencies:

```bash
npm install
```

Make a copy of `.env.example` file and fill in all environment variables:

```bash
cp .env.example .env
```

Set up local databases:

```bash
docker-compose up -d
```

Create tables:

```bash
npm run dev:db:create
```

Seed tables (optional):

```bash
npm run dev:db:seed
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
