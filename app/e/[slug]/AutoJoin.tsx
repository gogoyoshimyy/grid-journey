'use client';

import { useEffect, useState } from 'react';
import { joinEvent } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AutoJoin({ slug }: { slug: string }) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        const run = async () => {
            try {
                await joinEvent(slug);
                if (mounted) {
                    // Force hard navigation to ensure cookies are picked up
                    window.location.href = `/e/${slug}/play`;
                }
            } catch (e: any) {
                if (mounted) {
                    console.error(e);
                    // If event not found or other error, show it
                    setError(e.message || '参加処理に失敗しました');
                }
            }
        };

        run();

        return () => { mounted = false; };
    }, [slug]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center space-y-4">
                    <p className="text-red-600 font-bold">エラーが発生しました</p>
                    <p className="text-slate-600 text-sm">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-bold hover:bg-slate-200"
                    >
                        再読み込み
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-6">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-200 rounded-full" />
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-slate-600 font-bold animate-pulse">
                デモイベントを読み込んでいます...
            </p>
        </div>
    );
}
