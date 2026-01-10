
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Resetting database...');
    try {
        await prisma.$executeRawUnsafe('DROP SCHEMA public CASCADE;');
        await prisma.$executeRawUnsafe('CREATE SCHEMA public;');
        await prisma.$executeRawUnsafe('GRANT ALL ON SCHEMA public TO postgres;');
        await prisma.$executeRawUnsafe('GRANT ALL ON SCHEMA public TO public;');
        console.log('Database reset successfully.');
    } catch (e) {
        console.error('Error resetting database:', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
