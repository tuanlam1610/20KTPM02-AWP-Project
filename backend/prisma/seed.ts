// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create two dummy articles
  const post1 = await prisma.user.upsert({
    where: { email: 'rexfury121@gmail.com' },
    update: {},
    create: {
      name: 'Truong Gia Huy',
      email: 'rexfury121@gmail.com',
      hash: '123456',
      dob: new Date('2002-12-31T23:00:00.000Z'),
    },
  });

  const post2 = await prisma.user.upsert({
    where: { email: 'quangcui@gmail.com' },
    update: {},
    create: {
      name: 'Nguyen Ngoc Qua g',
      email: 'quangcui@gmail.com',
      hash: '123456',
      dob: new Date('2002-10-31T23:00:00.000Z'),
    },
  });

  console.log({ post1, post2 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
