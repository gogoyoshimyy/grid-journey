
import { joinEvent } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';

export default async function EventLandingPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const { slug } = params;

    const event = await prisma.event.findUnique({
        where: { slug },
        include: { adSlots: { include: { sponsor: true } } }
    });

    if (!event) {
        return <div className="p-8 text-center">Event not found</div>;
    }

    const joinAction = async () => {
        'use server';
        await joinEvent(slug);
        redirect(`/e/${slug}/play`);
    };

    const footerAd = event.adSlots.find(s => s.slotKey === 'participant_join_footer');

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 relative">
            <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8 max-w-md mx-auto w-full">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">{event.title}</h1>
                    <p className="text-slate-500">{event.timeLimitMinutes} Minutes Challenge</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 w-full space-y-4">
                    <h2 className="font-semibold text-lg">Rules</h2>
                    <div className="text-sm text-slate-600 space-y-2">
                        <p>1. Find items matching the Kanji.</p>
                        <p>2. Take a photo or write text.</p>
                        <p>3. Submit and wait for approval.</p>
                        <p>4. Get Bingo lines for extra points!</p>
                    </div>
                </div>

                <form action={joinAction} className="w-full">
                    <Button size="lg" className="w-full text-lg shadow-blue-200 shadow-lg">
                        Join Event
                    </Button>
                </form>
            </div>

            {footerAd && (
                <div className="w-full bg-white p-4 border-t border-slate-200 pb-safe">
                    <div className="max-w-md mx-auto">
                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">Sponsored</p>
                        {footerAd.sponsor ? (
                            <div className="flex items-center gap-3">
                                <div className="bg-slate-100 w-10 h-10 rounded-full flex items-center justify-center text-xs">Logo</div>
                                <div>
                                    <p className="font-bold text-sm">{footerAd.sponsor.name}</p>
                                    <p className="text-xs text-slate-500">{footerAd.sponsor.message}</p>
                                </div>
                            </div>
                        ) : (
                            <p>{footerAd.messageText}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
