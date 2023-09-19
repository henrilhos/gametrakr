# API - Contributing Guide

## Setup

For gametrakr api we use [Go](https://go.dev/), [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/), we also reccomend to use [Make](https://www.gnu.org/software/make/) to run our scripts.

To see which versions of Go we use, check the [`go.mod`](../api/go.mod).

### Getting started

Clone the repository:

```bash
git clone https://github.com/henrilhos/gametrakr.git
cd api # since we have a monorepo

make compose
make dev
```

# Useful links

- [Go](https://go.dev/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Fiber](https://docs.gofiber.io/)
- [Air](https://github.com/cosmtrek/air)
- [GoDotEnv](https://github.com/joho/godotenv)
- [GORM](https://gorm.io/)
