// prisma/clear.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    // Delete in proper order due to foreign key constraints
    await prisma.like.deleteMany({});
    await prisma.savedPosts.deleteMany({});
    await prisma.follow.deleteMany({});
    await prisma.post.deleteMany({});
    await prisma.user.deleteMany({});

    console.log("✅ Database cleared.");
  } catch (err) {
    console.error("❌ Failed to clear database:", err);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();
