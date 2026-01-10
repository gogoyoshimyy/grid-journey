
import prisma from '@/lib/db';
import ReviewList from './ReviewList';

export default async function ReviewPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const submissions = await prisma.submission.findMany({
        where: {
            run: { eventId: params.id },
            status: 'pending'
        },
        include: {
            tile: true,
            run: true
        },
        orderBy: { submittedAt: 'asc' }
    });

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-2xl mx-auto space-y-6">
                <header className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Review Queue</h1>
                    <div className="bg-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                        Pending: {submissions.length}
                    </div>
                </header>

                <ReviewList initialSubmissions={submissions} eventId={params.id} />
            </div>
        </div>
    );
}
