import { PrismaClient, UserRole } from '@prisma/client';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Generate API key
  const apiKey = crypto.randomBytes(32).toString('hex');
  
  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin12345', salt);

  // Create default admin user
  const adminUser = await prisma.user.upsert({
    where: { apiKey: apiKey, email: "admin@example.com" },
    update: {
      password: hashedPassword,
      email: "admin@example.com",
      role: UserRole.ADMIN
    },
    create: {
      apiKey: apiKey,
      email: 'admin@example.com',
      password: hashedPassword,
      role: UserRole.ADMIN
    },
  });

  console.log('Created admin user:', {
    id: adminUser.id,
    role: adminUser.role,
    apiKey: adminUser.apiKey
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 