# Applification Blog

> Source code for [applification.net](https://applification.net).

## Architecture

```mermaid
  flowchart LR
  A(Turborepo) --> B(Packages)
  B(Packages) --> C(UI Library)
  B(Packages) --> D(Config)
  C(UI Library) --> E(Apps)
  D(Config) --> E(Apps)
  E(Apps) --> F(Remix)
  F(Remix) <--> G(Prisma Client)
  F(Remix) <--> L(Tailwind CSS)
  I(Prisma) <--> H(Node JS)
  H(Node JS) <--> F(Remix)
  I(Prisma) <--> J(PostgreSQL)
  H(Node JS) <--> K(Fly.io)
  J(PostgresSQL) <--> K(Fly.io)
```

## What's inside?

The primary technologies used in this site are:

- [React](https://reactjs.org/): for the UI
- [Tailwind CSS](https://tailwindcss.com/): Utility classes for consistent/maintainable styling
- [Remix.run](http://remix.run/): Framework for the Client/Server/Routing
- [TypeScript](https://www.typescriptlang.org/): Typed JavaScript
- [Prisma](https://www.prisma.io/): ORM with migrations and TypeScript client support
- [Postgres](https://www.postgresql.org/): Battle tested SQL database
- [Turborepo](https://turborepo.org): High performance build system for TypeScript monorepos

The services this site uses:

- [Fly.io](http://fly.io/): Edge hosting platform
- [GitHub Actions](https://github.com/features/actions): Hosted CI pipeline services
- [Cloudinary](https://cloudinary.com/): Image hosting and transformation services
- [Sentry](https://sentry.io/): Error reporting services
- [Metronome](https://metronome.sh/): Remix metrics service

## Architure choices

> Read about the choices behind this stack at [https://applification.net/posts/remixing-this-blog](https://applification.net/posts/remixing-this-blog)

### Apps and Packages

- `blog`: a Remix app
- `ui`: a React component library that can be shared by other applications in the monorepo
- `config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```bash
npm run build
```

### Develop

To develop all apps and packages, run the following command:

Provisioning a PostgreSQL database:

```bash
docker compose up
```

To sync Prisma schema with PostgresSQL database:

```bash
npx prisma db push
```

To seed the database with some dummy data:

```bash
npx prisma db seed
```

Run the app in development mode:

```bash
npm run dev
```

<!-- TODO: merge dev command into docker compose -->

When changes to `prisma/schema.prisma` are made migrations need to be run with:

```bash
npx prisma migrate dev --name ${name_the_migration}
```

## DB Connection

`fly proxy 15432:5432 -a c-pg-dev`

## C.I Deployment

### Testing Docker Builds

```bash
# Run the app
docker compose up

# Inspect files in image
docker build -f Dockerfile.dev . -t blog-dev
docker run -it blog-dev sh
```

The app is configured with GitHub Actions and Fly. Any push to the `main` branch will deploy to Fly.io.

Database migrations are automatically applied on deployment via the `start_with_migrations.sh` script triggered from the `fly.toml` config.
