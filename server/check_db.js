const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.count();
  const products = await prisma.product.count();
  const cart = await prisma.cartItem.count();
  console.log({ users, products, cart });
}

main().catch(console.error).finally(() => prisma.$disconnect());
