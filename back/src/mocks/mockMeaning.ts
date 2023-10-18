import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function groupWords() {
  const words = await prisma.word.findMany({
    select: { meaning: true },
  });

  const groups = [];

  for (let i = 0; i < words.length; i += 3) {
    const group = words.slice(i, i + 3).map((word) => word.meaning);
    groups.push(group);
  }

  for (const group of groups) {
    await prisma.meaningGroup.create({
      data: { meanings: group },
    });
  }
}

groupWords()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

// npx ts-node src/mocks/mockMeaning.ts