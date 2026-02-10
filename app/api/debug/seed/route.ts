
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
            update: {
                gridSize: 4, // Update to 4x4
                title: '鹿児島 街歩きビンゴ (4x4)',
                description: '鹿児島の名物を探して写真を撮ろう！',
            },
            create: {
                slug: 'demo-bingo',
                title: '鹿児島 街歩きビンゴ (4x4)',
                organizerId: organizer.id,
                gridSize: 4,
                timeLimitMinutes: 60,
                lineBonusPoints: 100,
                maxResubmits: 2,
                status: 'active',
                description: '鹿児島の名物を探して写真を撮ろう！',
            },
        });

        // 3. Create Sponsors
        const sponsorA = await prisma.sponsor.create({
            data: {
                eventId: event.id,
                name: '薩摩観光協会',
                message: '鹿児島を楽しもう！',
                perkText: '特産品 10% OFF',
            }
        });

        // 4. Wipe existing tiles/runs for this event
        await prisma.run.deleteMany({
            where: { eventId: event.id }
        });

        await prisma.tile.deleteMany({
            where: { eventId: event.id }
        });

        // 5. Create Tiles (4x4 = 16 tiles)
        // Kagoshima Themed Kanji List
        const kagosimaKanji = [
            '桜', '島', '芋', '黒',
            '豚', '湯', '西', '郷',
            '海', '山', '駅', '電',
            '港', '鳥', '犬', '愛'
        ];

        const tilesData = [];
        let count = 0;
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                let type = 'normal';
                let publishTime = null;
                let kanji = kagosimaKanji[count] || `${count + 1}`;

                // Center-ish bonus (1,1) or (2,2)
                if (x === 1 && y === 1) {
                    type = 'event';
                }

                tilesData.push({
                    eventId: event.id,
                    coordinateX: x,
                    coordinateY: y,
                    kanji: kanji,
                    description: `${kanji}に関連する写真を撮ろう`,
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

        return NextResponse.json({ success: true, message: 'Seeding complete for demo-bingo (4x4 Kagoshima)' });
    } catch (error: any) {
        console.error('Seeding failed:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
