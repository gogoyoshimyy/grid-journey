
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { addMinutes } from 'date-fns';

export async function GET() {
    try {
        console.log('Seeding via API...');

        // 1. Create Organizer
        const organizer = await prisma.organizerUser.upsert({
            where: { email: 'admin@demo.com' },
            update: {},
            create: {
                email: 'admin@demo.com',
                password: 'hashed_password_mock',
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

        // 3. Sponsors
        const sponsorA = await prisma.sponsor.create({
            data: {
                eventId: event.id,
                name: 'TechCorp',
                message: 'Empowering Developers',
                perkText: 'Get 10% off',
            }
        });

        // 4. Tiles
        const tilesData = [];
        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
                let type = 'normal';
                let publishTime = null;
                let kanji = `字${x}${y}`;

                if (x === 2 && y === 2) {
                    type = 'event';
                    kanji = '真'; // Center
                }

                if (x === 4 && y === 4) {
                    publishTime = addMinutes(new Date(), 30); // Future
                }

                // Check if exists
                const exists = await prisma.tile.findFirst({
                    where: {
                        eventId: event.id,
                        coordinateX: x,
                        coordinateY: y
                    }
                });

                if (!exists) {
                    await prisma.tile.create({
                        data: {
                            eventId: event.id,
                            coordinateX: x,
                            coordinateY: y,
                            kanji: kanji,
                            description: `Find something related to ${kanji} at ${x},${y}`,
                            hint: 'Look around!',
                            tilePoints: 10,
                            tileType: type,
                            eventBonusPoints: type === 'event' ? 50 : 0,
                            submissionFormat: 'any',
                            publishAt: publishTime,
                        }
                    });
                }
            }
        }

        // 5. AdSlots
        await prisma.adSlot.create({
            data: {
                eventId: event.id,
                slotKey: 'participant_join_footer',
                sponsorId: sponsorA.id,
            }
        });

        return NextResponse.json({ success: true, message: 'Seeded demo-bingo' });
    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
