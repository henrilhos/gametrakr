# Contributing Guide

## Setup

For gametrakr api we use [Java 17](https://jdk.java.net/17/), [Kotlin](https://kotlinlang.org/) and [Gradle](https://gradle.org/), we highly reccomend to use a version manager like [asdf]() to manage your Java and Kotlin versions.

You will also need to install [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/), to run the database.

To see which versions we're using, please check the [`.tool-versions`](../.tool-versions) file.

### Getting started

Clone the repository:

```bash
git clone https://github.com/henrilhos/gametrakr.git
cd api # since we have a monorepo
```

We reccomend to use an IDE such as [IntelliJ IDEA](https://www.jetbrains.com/idea/) to develop and run gametrakr api, but you can also use the command line:

```bash
# to run the database
docker-compose up [-d]

./gradlew bootRun
# or
gradle bootRun
```

## Useful links

- [Kotlin](https://kotlinlang.org/)
- [Spring Boot](https://spring.io/projects/spring-boot)
