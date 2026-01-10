
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTiles() {
    const slug = 'demo-bingo';
    const event = await prisma.event.findUnique({ where: { slug } });
    if (!event) return;

    const tiles = await prisma.tile.findMany({ where: { eventId: event.id } });
    console.log(`Total Tiles: ${tiles.length}`);

    // Check fixed count
    const fixedCount = tiles.filter(t => t.isFixed).length;
    console.log(`Fixed Tiles: ${fixedCount}`);

    // Sample a tile
    if (tiles.length > 0) {
        console.log('Sample Tile:', tiles[0]);
    }
}

checkTiles()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
