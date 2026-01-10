
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAsakusa() {
    // Check for slug 'asakusa' or 'asakusa-bingo'
    const slugs = ['asakusa', 'asakusa-bingo'];

    for (const slug of slugs) {
        const event = await prisma.event.findUnique({ where: { slug } });
        if (event) {
            console.log(`Found Event: ${slug} (${event.id})`);
            const tiles = await prisma.tile.findMany({ where: { eventId: event.id } });
            const fixedCount = tiles.filter(t => t.isFixed).length;
            console.log(`- Total Tiles: ${tiles.length}`);
            console.log(`- Fixed Tiles: ${fixedCount}`);
            if (tiles.length > 0) console.log(`- Sample Tile: ${tiles[0].kanji} (isFixed: ${tiles[0].isFixed})`);
        } else {
            console.log(`Event '${slug}' not found.`);
        }
    }
}

checkAsakusa()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
