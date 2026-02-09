
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { addMinutes } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log('Seeding data via API...');

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

        // 3. Create Sponsors
        const sponsorA = await prisma.sponsor.create({
            data: {
                eventId: event.id,
                name: 'TechCorp',
                message: 'Empowering Developers',
                perkText: 'Get 10% off',
            }
        });

        // 4. Wipe existing tiles/runs for this event
        await prisma.run.deleteMany({
            where: { eventId: event.id }
        });

        await prisma.tile.deleteMany({
            where: { eventId: event.id }
        });

        // 5. Create Tiles
        const tilesData = [];
        let count = 1;
        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
                let type = 'normal';
                let publishTime = null;
                let kanji = `${count}`;

                if (x === 2 && y === 2) {
                    type = 'event';
                }

                if (x === 4 && y === 4) {
                    publishTime = addMinutes(new Date(), 30);
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
                    submissionFormat: 'any',
                    isFixed: false
                });
                count++;
            }
        }

        // Batch create tiles
        for (const t of tilesData) {
            await prisma.tile.create({
                data: {
                    ...t,
                    submissionFormat: 'any'
                } as any
            });
        }

        // 6. AdSlots
        await prisma.adSlot.create({
            data: {
                eventId: event.id,
                slotKey: 'participant_join_footer',
                sponsorId: sponsorA.id,
            }
        });

        return NextResponse.json({ success: true, message: 'Seeding complete for demo-bingo' });
    } catch (error: any) {
        console.error('Seeding failed:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
