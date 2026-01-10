
'use client';
import { createEvent } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function NewEventPage() {
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        const id = await createEvent(formData);
        router.push(`/admin/events/${id}/tiles`); // Go to editor
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 flex justify-center items-center">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-6 border border-slate-200">
                <h1 className="text-2xl font-black text-slate-900">新規イベント作成</h1>

                <form action={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold mb-1 text-slate-800">イベント名</label>
                        <input name="title" required className="w-full border border-slate-300 p-3 rounded text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="例: 浅草フォトビンゴ" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1 text-slate-800">URLスラッグ (ID)</label>
                        <input name="slug" required className="w-full border border-slate-300 p-3 rounded text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="asakusa-bingo" />
                        <p className="text-xs text-slate-500 mt-1 font-mono">URL: /e/[slug]</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-bold mb-1 text-slate-800">グリッドサイズ</label>
                            <select name="size" className="w-full border border-slate-300 p-3 rounded text-slate-900 bg-white">
                                <option value="3">3 x 3</option>
                                <option value="4">4 x 4</option>
                                <option value="5">5 x 5</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-bold mb-1 text-slate-800">制限時間 (分)</label>
                            <input name="timeLimit" type="number" defaultValue="60" className="w-full border border-slate-300 p-3 rounded text-slate-900" />
                        </div>
                    </div>

                    <Button className="w-full font-bold text-lg py-6 shadow-md mt-4">作成してタイル編集へ</Button>
                </form>
            </div>
        </div>
    );
}
