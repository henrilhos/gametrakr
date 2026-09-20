# Contributing Guide

## Setup

For development we use [Node.js](https://nodejs.org) as our runtime and [npm](https://npmjs.com) as our package manager, to check out the versions we're using, please check the [`.tool-versions`](.tool-versions) file.

### Getting started

1. Clone the repository:

```bash
git clone https://github/com/henrilhos/gametrakr.git
cd gametrakr
```

2. Install deps

```bash
npm install
```

3. Update `.env` and push the schema to the db

```bash
cp .env.example .env
npm run prisma db push
```

4. Start the dev server

```bash
npm run dev
```

5. Run the tests

```bash
npm test
```

## Stack

This project follows the [T3 Stack](https://create.t3.gg) and was bootstrapped with `create-t3-app`.

### Technologies

If you are not familiar with the different technologies used in this project, please refer to the respective docs.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

### Learn More

To learn more aboout the [T3 Stack](https://create.t3.gg), take a look at the following resources:

- [Documentation](https://create.t3.gg)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials
