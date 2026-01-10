
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateTile } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { cn } from '@/components/ui/button'; // reuse

export default function TileEditor({ event }: { event: any }) {
    const [selectedTile, setSelectedTile] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSaving) return;

        setIsSaving(true);
        try {
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            await updateTile(selectedTile.id, data);

            // Success feedback mostly handled by UI saving state and clearing selection
            setSelectedTile(null);
            router.refresh();
        } catch (e) {
            alert('エラーが発生しました');
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 flex gap-6 text-slate-900">
            {/* Grid Preview */}
            <div className="flex-1 flex flex-col items-center">
                <h1 className="text-2xl font-black mb-4 text-black">{event.title} - タイル編集</h1>

                <div className="mb-4 text-sm text-slate-600 max-w-md text-center bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                    <p><strong><span className="text-red-500">■</span> シークレット(Secret)</strong>: 全員、同じ位置に配置されます。</p>
                    <p><strong><span className="text-slate-400">□</span> ランダム(Random)</strong>: シークレット以外のマスにシャッフル配置されます。</p>
                </div>

                {/* Fixed Grid Preview */}
                <h2 className="font-bold mb-2 text-slate-800">シークレット配置 (Secret Layout)</h2>
                <div className={cn(
                    "grid gap-2 border-2 border-slate-300 p-4 bg-white rounded-xl shadow-sm mb-8",
                    event.gridSize === 3 && "grid-cols-3",
                    event.gridSize === 4 && "grid-cols-4",
                    event.gridSize === 5 && "grid-cols-5"
                )}>
                    {Array.from({ length: event.gridSize * event.gridSize }).map((_, i) => {
                        const x = i % event.gridSize;
                        const y = Math.floor(i / event.gridSize);
                        const fixedTile = event.tiles.find((t: any) => t.isFixed && t.coordinateX === x && t.coordinateY === y);

                        if (fixedTile) {
                            return (
                                <TileButton
                                    key={fixedTile.id}
                                    tile={fixedTile}
                                    selected={selectedTile?.id === fixedTile.id}
                                    onClick={() => setSelectedTile(fixedTile)}
                                    fixed={true}
                                    index={i + 1}
                                />
                            );
                        } else {
                            // Empty Slot (Random)
                            return (
                                <div key={i} className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded bg-slate-50 text-slate-400 relative">
                                    <span className="absolute top-1 left-1 text-[10px] opacity-50 font-mono">{i + 1}</span>
                                    <span className="text-xs font-bold">ランダム</span>
                                </div>
                            );
                        }
                    })}
                </div>

                {/* Pool Inspector */}
                <h2 className="font-bold mb-2 text-slate-800">ランダムプール (残り: {event.tiles.filter((t: any) => !t.isFixed).length}個)</h2>
                <div className="flex flex-wrap gap-2 max-w-lg justify-center p-4 bg-slate-100 border border-slate-200 rounded-xl min-h-[100px]">
                    {event.tiles.filter((t: any) => !t.isFixed).map((tile: any) => (
                        <TileButton
                            key={tile.id}
                            tile={tile}
                            selected={selectedTile?.id === tile.id}
                            onClick={() => setSelectedTile(tile)}
                            fixed={false}
                        />
                    ))}
                    <div className="w-20 h-20 flex items-center justify-center border-2 border-dashed border-slate-300 rounded text-slate-500 cursor-pointer hover:bg-white hover:border-blue-400 bg-slate-50 transition-all font-bold text-sm" onClick={() => alert("タイルの追加は現在APIからのみ可能です。")}>
                        + 追加
                    </div>
                </div>

                <div className="mt-8">
                    <Button variant="secondary" onClick={() => router.push('/admin')}>
                        &larr; ダッシュボードに戻る
                    </Button>
                </div>
            </div>

            {/* Edit Panel */}
            <div className="w-96 bg-white p-6 rounded-xl shadow-lg border border-slate-200 h-fit">
                {selectedTile ? (
                    <form key={selectedTile.id} onSubmit={handleSave} className="space-y-4">
                        <h2 className="font-bold text-lg border-b pb-2 text-slate-900">タイル編集</h2>
                        <div className="bg-slate-50 p-2 rounded text-xs text-slate-600 mb-2 font-mono border border-slate-100">
                            ID: {selectedTile.id.substring(0, 8)}... <br />
                            {selectedTile.isFixed ? `位置: (X:${selectedTile.coordinateX}, Y:${selectedTile.coordinateY})` : '位置: ランダムプール'}
                        </div>

                        <div>
                            <label className="block text-xs font-bold mb-1 text-slate-700">表示文字 (漢字1文字)</label>
                            <input name="kanji" defaultValue={selectedTile.kanji} className="w-full border border-slate-300 p-2 rounded text-2xl font-black text-center text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" maxLength={1} required />
                        </div>

                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label className="block text-xs font-bold mb-1 text-slate-700">ポイント</label>
                                <input name="tilePoints" type="number" defaultValue={selectedTile.tilePoints} className="w-full border border-slate-300 p-2 rounded text-slate-900" required />
                            </div>
                        </div>

                        <div className="bg-blue-50 p-3 rounded border border-blue-100 space-y-3">
                            <div>
                                <label className="flex items-center gap-2 font-bold text-sm text-slate-900 cursor-pointer">
                                    <input
                                        name="isFixed"
                                        type="checkbox"
                                        defaultChecked={selectedTile.isFixed}
                                        onChange={(e) => {
                                            const form = e.target.closest('form');
                                            if (form) (form as any).dataset.secret = e.target.checked.toString();
                                            setSelectedTile({ ...selectedTile, isFixed: e.target.checked });
                                        }}
                                        className="w-4 h-4 accent-blue-600"
                                    />
                                    シークレットマスにする
                                </label>
                                <p className="text-xs text-slate-500 mt-1 pl-6 leading-tight">
                                    チェックすると、このタイルは全員の <strong>(X:{selectedTile.coordinateX}, Y:{selectedTile.coordinateY})</strong> にシークレットとして配置されます。
                                </p>
                            </div>

                            {selectedTile.isFixed && (
                                <div className="space-y-3 pl-6 border-l-2 border-blue-200 ml-1">
                                    <div>
                                        <label className="block text-xs font-bold mb-1 text-slate-700">説明・お題 (シークレット用)</label>
                                        <textarea name="description" defaultValue={selectedTile.description} className="w-full border border-slate-300 p-2 rounded text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" rows={3} required />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold mb-1 text-slate-700">提出フォーマット制限</label>
                                        <select name="submissionFormat" defaultValue={selectedTile.submissionFormat} className="w-full border border-slate-300 p-2 rounded text-slate-900 bg-white">
                                            <option value="any">写真 または テキスト</option>
                                            <option value="photo_only">写真のみ (Photo only)</option>
                                            <option value="text_only">テキストのみ (Text only)</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Button type="submit" disabled={isSaving} className="w-full font-bold shadow-sm">
                            {isSaving ? '保存中...' : '変更を保存'}
                        </Button>
                    </form>
                ) : (
                    <div className="text-center text-slate-400 py-24 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <p className="font-bold text-slate-500">タイルを選択</p>
                        <p className="text-xs mt-1">詳細を編集できます</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function TileButton({ tile, selected, onClick, fixed, index }: any) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "w-20 h-20 flex flex-col items-center justify-center border-2 rounded-lg transition-all hover:bg-blue-50 bg-white text-black relative shadow-sm",
                selected ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200 z-10" : "border-slate-300",
                !fixed && "border-dashed bg-slate-50 border-slate-300 text-slate-500"
            )}
        >
            {index && <span className="absolute top-1 left-1 text-[10px] text-slate-400 font-mono">{index}</span>}
            {fixed && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white shadow-sm" title="Fixed" />}

            <span className="font-black text-2xl">{tile.kanji}</span>
            <span className="text-[10px] text-slate-500 font-bold">{tile.tilePoints}pt</span>
        </button>
    )
}
