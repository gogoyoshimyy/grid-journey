import prisma from '@/lib/db';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AutoJoin from './AutoJoin';

export const dynamic = 'force-dynamic';

export default async function EventLandingPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const { slug } = params;

    // Check existing session
    const cookieStore = await cookies();
    const deviceId = cookieStore.get('bingo_device_id')?.value;
    if (deviceId) {
        const existingRun = await prisma.run.findFirst({
            where: {
                event: { slug },
                OR: [
                    { deviceId: deviceId },
                    { participantName: deviceId }
                ]
            }
        });
        if (existingRun) {
            redirect(`/e/${slug}/play`);
        }
    }

    // If no session, check if event exists then show AutoJoin
    const event = await prisma.event.findUnique({
        where: { slug },
        select: { id: true }
    });

    if (!event) {
        return <div className="p-8 text-center text-slate-500">イベントが見つかりません</div>;
    }

    // Pass slug to Client Component to trigger Server Action
    return <AutoJoin slug={slug} />;
}
