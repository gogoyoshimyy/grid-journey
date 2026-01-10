
import { PrismaClient } from '@prisma/client';
import { addHours, addMinutes } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding data...');

    // 1. Create Organizer
    const organizer = await prisma.organizerUser.upsert({
        where: { email: 'admin@demo.com' },
        update: {},
        create: {
            email: 'admin@demo.com',
            password: 'hashed_password_mock', // In real app, hash this
            name: 'Demo Admin',
        },
    });

    // 2. Create Event
    const event = await prisma.event.upsert({
        where: { slug: 'demo-bingo' },
        update: {},
        create: {
            slug: 'demo-bingo',
            title: 'Demo Photo Bingo 5x5',
            organizerId: organizer.id,
            gridSize: 5,
            timeLimitMinutes: 60,
            lineBonusPoints: 100,
            maxResubmits: 2,
            status: 'active',
            description: 'Take photos of these items! 5x5 Grid.',
        },
    });

    // 3. Create Sponsors
    const sponsorA = await prisma.sponsor.create({
        data: {
            eventId: event.id,
            name: 'TechCorp',
            message: 'Empowering Developers',
            perkText: 'Get 10% off',
        }
    });

    // Wipe existing tiles to ensure clean slate for 1-25 update
    // Also wipe Runs so that gridMaps are regenerated with new tile IDs
    await prisma.run.deleteMany({
        where: { eventId: event.id }
    });

    await prisma.tile.deleteMany({
        where: { eventId: event.id }
    });

    const tilesData = [];
    let count = 1;
    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
            let type = 'normal';
            let publishTime = null;
            let kanji = `${count}`; // 1..25

            // Center tile: used to be '真', now just number (13)
            if (x === 2 && y === 2) {
                type = 'event';
                // kanji is already set to number '13'
            }

            if (x === 4 && y === 4) {
                publishTime = addMinutes(new Date(), 30); // 30 mins in future
            }

            tilesData.push({
                eventId: event.id,
                coordinateX: x,
                coordinateY: y,
                kanji: kanji,
                description: '',
                hint: '',
                tilePoints: 10,
                tileType: type,
                eventBonusPoints: type === 'event' ? 50 : 0,
                publishAt: publishTime,
                submissionFormat: 'any', // Explicitly set here
                isFixed: false // Default to normal
            });
            count++;
        }
    }

    // Batch create tiles
    for (const t of tilesData) {
        await prisma.tile.create({
            data: {
                ...t,
                submissionFormat: 'any' // Redundant but explicit for safety
            } as any
        });
    }

    // 5. AdSlots
    await prisma.adSlot.create({
        data: {
            eventId: event.id,
            slotKey: 'participant_join_footer',
            sponsorId: sponsorA.id,
        }
    });

    console.log('Seeding complete. Event Slug: demo-bingo');
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
