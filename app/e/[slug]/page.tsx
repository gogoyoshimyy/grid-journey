import prisma from '@/lib/db';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AutoJoin from './AutoJoin';

export const dynamic = 'force-dynamic';

export default async function EventLandingPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;

    try {
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
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-50">
                    <div className="p-8 text-center text-slate-500 bg-white rounded-xl shadow-sm">
                        <h1 className="text-xl font-bold mb-2">イベントが見つかりません</h1>
                        <p className="text-sm">slug: {slug}</p>
                    </div>
                </div>
            );
        }

        // Pass slug to Client Component to trigger Server Action
        return <AutoJoin slug={slug} />;
    } catch (error: any) {
        // Log error and show UI
        console.error("EventLandingPage Error:", error);

        // Handle redirect errors (do not suppress)
        if (error.message === 'NEXT_REDIRECT') {
            throw error;
        }

        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="p-8 text-center bg-white rounded-xl shadow-lg border border-red-100 max-w-md w-full">
                    <h1 className="text-xl font-bold text-red-600 mb-4">システムエラーが発生しました</h1>
                    <div className="bg-slate-100 p-4 rounded text-left overflow-auto max-h-40 text-xs font-mono mb-4 text-slate-700">
                        {error.message || JSON.stringify(error)}
                    </div>
                    <p className="text-sm text-slate-500">
                        管理者にこの画面を共有してください。
                        <br />
                        (Digest: {error.digest})
                    </p>
                </div>
            </div>
        );
    }
}
