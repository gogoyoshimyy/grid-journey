
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyRandomness() {
    const slug = 'demo-bingo';
    const event = await prisma.event.findUnique({ where: { slug } });
    if (!event) {
        console.log('Event not found');
        return;
    }

    // Function to simulate join logic (simplified from actions.ts)
    async function simulateJoin(userId) {
        // 1. Get Tiles
        const tiles = await prisma.tile.findMany({ where: { eventId: event.id } });
        const fixedTiles = tiles.filter(t => t.isFixed);
        const poolTiles = tiles.filter(t => !t.isFixed);

        // 2. Shuffle
        // Fisher-Yates
        for (let i = poolTiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [poolTiles[i], poolTiles[j]] = [poolTiles[j], poolTiles[i]];
        }

        // 3. Map to Grid
        const newMap = {};
        for (let y = 0; y < event.gridSize; y++) {
            for (let x = 0; x < event.gridSize; x++) {
                const fixed = fixedTiles.find(t => t.coordinateX === x && t.coordinateY === y);
                if (fixed) {
                    newMap[`${x},${y}`] = fixed.kanji; // Store Kanji for visualization
                } else {
                    const next = poolTiles.pop();
                    if (next) newMap[`${x},${y}`] = next.kanji;
                }
            }
        }
        return newMap;
    }

    const start = Date.now();
    const user1Map = await simulateJoin('user1');
    // Ensure separate randomness context if needed (not needed for Math.random)

    const user2Map = await simulateJoin('user2');

    console.log('--- User 1 Board ---');
    printGrid(user1Map, event.gridSize);

    console.log('\n--- User 2 Board ---');
    printGrid(user2Map, event.gridSize);

    // Compare
    const isDifferent = JSON.stringify(user1Map) !== JSON.stringify(user2Map);
    console.log('\nAre boards different?', isDifferent);
}

function printGrid(map, size) {
    for (let y = 0; y < size; y++) {
        let row = '';
        for (let x = 0; x < size; x++) {
            const val = map[`${x},${y}`] || '  ';
            row += String(val).padEnd(4, ' ');
        }
        console.log(row);
    }
}

verifyRandomness()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
