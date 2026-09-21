# gametrakr

## About

**gametrakr** is an online platform dedicated to video game enthusiasts, designed to provide a unique experience for exploring, cataloging, and interacting in the world of video games. Whether you're a casual gamer or a hardcore enthusiast, **gametrakr** puts the power of video games at your fingertips.

## Local development

The local stack runs PostgreSQL, Redis, and Mailpit. Profile images are stored
under `.local/uploads`, which is ignored by Git.

```bash
npm ci
cp .env.example .env
docker compose up -d
npm run db:migrate
npm run dev
```

Set `TWITCH_CLIENT_ID` and `TWITCH_SECRET_ID` in `.env`: game search and game
details continue to use IGDB. Link-metadata previews likewise continue to call
Dub. No Resend, UploadThing, Upstash, or Vercel Analytics credentials are
needed when `LOCAL_DEV=true` and `NEXT_PUBLIC_LOCAL_DEV=true`.

Mailpit is available at [localhost:8025](http://localhost:8025). The local
services use their standard ports: PostgreSQL `5432`, Redis `6379`, and
Mailpit SMTP `1025`.

### Database integration tests

Database-backed tests use Testcontainers to start a disposable PostgreSQL
instance, apply the checked-in Drizzle migrations, and remove the container
when the suite finishes. They never connect to the development database.

Docker must be running locally before invoking the integration suite:

```bash
npm run test:integration
```

The regular `npm test` and `npm run test:run` commands remain unit-test-only
and do not require Docker.

## Use cases, requirements and models

You can check out the use cases, requirements and models in their respective locations:

- [Use cases](docs/use-cases.md)
- [Requirements](docs/requirements.md)
- [Models](docs/models.md)
- [Infrastructure](docs/infrastructure.md)

## Contributing guide

We welcome contributions from the community. If you'd like to contribute to the development of gametrakr, please check out the [contributing guide](CONTRIBUTING.md).

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
