# Contributing Guide

## Setup

For development we use [Node.js](https://nodejs.org) as our runtime and [pnpm](https://pnpm.io) as our package manager, to check out the versions we're using, please check the [`.tool-versions`](../.tool-versions) file.

### Getting started

Clone the repository and install dependencies:

```bash
git clone https://github/com/henrilhos/gametrakr.git
cd gametrakr

pnpm install
```

Then create your local `.env` file:

```bash
cp .env.example .env
```

And then run the development application:

```bash
docker-compose up -d
pnpm run dev
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
