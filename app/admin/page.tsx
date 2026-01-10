
import prisma from '@/lib/db';
import Link from 'next/link';

export default async function AdminDashboard() {
    const events = await prisma.event.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-black text-slate-900">管理ダッシュボード</h1>
                    <Link href="/admin/events/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-sm">
                        + 新規イベント作成
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-xl font-bold mb-4 text-slate-800">イベント一覧</h2>
                    <div className="space-y-4">
                        {events.map(event => (
                            <div key={event.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                                <div className="mb-4 md:mb-0">
                                    <h3 className="font-bold text-xl text-black">{event.title}</h3>
                                    <p className="text-sm text-slate-600 mt-1">
                                        Slug: <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">{event.slug}</span>
                                        <span className="mx-2 text-slate-300">|</span>
                                        Status: <span className="font-bold text-green-700">{event.status}</span>
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Link href={`/admin/events/${event.id}/tiles`} className="px-3 py-2 bg-slate-100 border border-slate-300 text-slate-800 rounded-lg text-sm font-bold hover:bg-slate-200">
                                        タイル編集
                                    </Link>
                                    <Link href={`/admin/events/${event.id}/review`} className="px-4 py-2 bg-blue-600 border border-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm">
                                        審査一覧
                                    </Link>
                                    <Link href={`/e/${event.slug}`} target="_blank" className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 text-sm font-bold hover:bg-slate-50">
                                        公開ページ
                                    </Link>
                                </div>
                            </div>
                        ))}

                        {events.length === 0 && (
                            <div className="text-center py-10 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                                <p className="text-slate-500 font-medium">まだイベントがありません。</p>
                                <p className="text-slate-400 text-sm mt-1">右上のボタンから作成してください。</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
