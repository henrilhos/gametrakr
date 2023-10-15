import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.carousel.upsert({
    where: { name: "Marvel's Spider-Man 2" },
    update: {},
    create: {
      imageUrl:
        "https://blog.br.playstation.com/tachyon/sites/4/2023/09/1e7bd7539e6c12744bec0368cc51d372761c22e4-scaled.jpeg",
      name: "Marvel's Spider-Man 2",
      publisher: "Insomniac Games",
      releaseDate: new Date("2023-10-20"),
    },
  });

  await prisma.carousel.upsert({
    where: { name: "Alan Wake II" },
    update: {},
    create: {
      imageUrl:
        "https://www.videogameschronicle.com/files/2023/02/alan-wake-2.jpg",
      name: "Alan Wake II",
      publisher: "Remedy Entertainment",
      releaseDate: new Date("2023-10-27"),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
