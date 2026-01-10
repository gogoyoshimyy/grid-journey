
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixAsakusa() {
    const slug = 'asakusa';
    const event = await prisma.event.findUnique({ where: { slug } });
    if (!event) return;

    // 1. Check/Fix TBD descriptions
    const tilesWithTBD = await prisma.tile.count({
        where: { eventId: event.id, description: 'TBD' }
    });
    console.log(`Tiles with 'TBD': ${tilesWithTBD}`);

    if (tilesWithTBD > 0) {
        console.log('Clearing TBD descriptions...');
        await prisma.tile.updateMany({
            where: { eventId: event.id, description: 'TBD' },
            data: { description: '' }
        });
    }

    // 2. Clear Runs to force re-shuffle for users
    const runCount = await prisma.run.count({ where: { eventId: event.id } });
    console.log(`Existing Runs: ${runCount}`);

    if (runCount > 0) {
        console.log('Deleting Runs to force re-shuffle...');
        await prisma.run.deleteMany({
            where: { eventId: event.id }
        });
    }
}

fixAsakusa()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
