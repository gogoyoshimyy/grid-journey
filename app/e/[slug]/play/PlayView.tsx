'use client';

import React, { useState, useTransition } from 'react';
import { refreshGame, submitTile, getLeaderboard, updateParticipantName } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Lock, Clock, CheckCircle, XCircle, RefreshCw, ZoomIn, ZoomOut, Camera } from 'lucide-react';
import { cn } from '@/components/ui/button';

type GameState = NonNullable<Awaited<ReturnType<typeof refreshGame>>>;

export default function PlayView({ initialData, slug }: { initialData: GameState; slug: string }) {
    const [data, setData] = useState(initialData);
    const [isPending, startTransition] = useTransition();
    const [zoomMode, setZoomMode] = useState(false);
    const [selectedTile, setSelectedTile] = useState<any>(null);
    const [showRanking, setShowRanking] = useState(false);
    const [rankingData, setRankingData] = useState<any[]>([]);

    const { event, run, serverTime, totalScore } = data;
    const gridSize = event.gridSize;

    // Nickname Logic
    const [showNameModal, setShowNameModal] = useState(
        (run.participantName || '').startsWith('user_') || !run.participantName
    );

    // Refresh Logic
    const handleRefresh = () => {
        startTransition(async () => {
            const newData = await refreshGame(slug);
            if (newData) setData(newData);
        });
    };

    // Render Tile
    const renderTile = (tile: any) => {
        const relevantSub = run.submissions
            .filter((s: any) => s.tileId === tile.id)
            .sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())[0];

        const isLocked = tile.publishAt ? new Date(tile.publishAt) > new Date(serverTime) : false;

        let status = 'open';
        if (isLocked) status = 'locked';
        else if (relevantSub) {
            status = relevantSub.status;
        }

        const baseStyles = "relative aspect-square rounded-lg flex flex-col items-center justify-center border-2 transition-all p-1";
        const statusStyles = {
            locked: "bg-slate-100 border-slate-200 text-slate-400",
            open: "bg-white border-blue-200 text-slate-900 active:bg-blue-50 shadow-sm",
            pending: "bg-yellow-50 border-yellow-300 text-yellow-800",
            approved: "bg-emerald-100 border-emerald-400 text-emerald-800",
            rejected: "bg-red-50 border-red-300 text-red-800",
        };

        return (
            <button
                key={tile.id}
                onClick={() => setSelectedTile({ tile, status, relevantSub })}
                disabled={isLocked}
                className={cn(baseStyles, statusStyles[status as keyof typeof statusStyles], "active:scale-95")}
            >
                <div className="absolute top-1 right-1">
                    {status === 'locked' && <Lock className="w-3 h-3" />}
                    {status === 'pending' && <Clock className="w-4 h-4 text-yellow-600" />}
                    {status === 'approved' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                    {status === 'rejected' && <XCircle className="w-4 h-4 text-red-500" />}
                </div>

                {status === 'locked' ? (
                    <span className="text-sm font-bold opacity-50">?</span>
                ) : (
                    <>
                        <span className={cn("font-bold font-kanji", gridSize >= 5 ? "text-xl" : "text-2xl")}>
                            {tile.kanji}
                        </span>
                        {gridSize < 5 && tile.description !== 'TBD' && <span className="text-[10px] text-center leading-tight line-clamp-2">{tile.description}</span>}
                    </>
                )}
            </button>
        );
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 pb-[env(safe-area-inset-bottom)]">
            <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200 px-4 py-3 flex justify-between items-center bg-opacity-95">
                <div>
                    <h1 className="font-bold text-sm text-slate-500 uppercase tracking-wider">合計ポイント</h1>
                    <div className="text-2xl font-black text-blue-600">{totalScore}</div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-slate-400">残り時間</div>
                    <div className="font-mono font-bold text-slate-700">
                        {event.timeLimitMinutes}分
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4">
                <div className="flex justify-end mb-2">
                    <button
                        onClick={() => setZoomMode(!zoomMode)}
                        className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full"
                    >
                        {zoomMode ? <ZoomOut className="w-3 h-3" /> : <ZoomIn className="w-3 h-3" />}
                        {zoomMode ? "全体" : "拡大"}
                    </button>
                </div>

                <div className={cn(
                    "grid gap-2 mx-auto transition-all",
                    gridSize === 3 && "grid-cols-3 max-w-sm",
                    gridSize === 4 && "grid-cols-4 max-w-md",
                    gridSize === 5 && "grid-cols-5 max-w-lg",
                    zoomMode ? "scale-100 min-w-[500px]" : "scale-100 w-full"
                )}
                    style={zoomMode ? { overflowX: 'auto', display: 'grid' } : {}}
                >
                    {event.tiles.map(renderTile)}
                </div>

                {zoomMode && <p className="text-xs text-center text-slate-400 mt-2">横にスクロールできます</p>}
            </main>

            <div className="sticky bottom-0 bg-white border-t border-slate-200 p-3 pb-[calc(12px+env(safe-area-inset-bottom))] flex items-center justify-between shadow-[0_-5px_15px_rgba(0,0,0,0.05)] z-20">
                <div className="flex gap-4 w-full max-w-md mx-auto">
                    <Button variant="secondary" size="sm" className="flex-1" onClick={handleRefresh} disabled={isPending}>
                        <RefreshCw className={cn("w-4 h-4 mr-2", isPending && "animate-spin")} />
                        更新
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={async () => {
                        setShowRanking(true);
                        const lb = await getLeaderboard(slug);
                        setRankingData(lb);
                    }}>
                        ランキング
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                        結果
                    </Button>
                </div>
            </div>

            {selectedTile && (
                <SubmissionModal
                    tile={selectedTile.tile}
                    status={selectedTile.status}
                    submission={selectedTile.relevantSub}
                    onClose={() => setSelectedTile(null)}
                    slug={slug}
                    runId={run.id}
                />
            )}

            {showNameModal && (
                <NicknameModal
                    runId={run.id}
                    onSave={() => {
                        setShowNameModal(false);
                        handleRefresh();
                    }}
                />
            )}

            {showRanking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
                    <div className="bg-white w-full max-w-sm rounded-xl p-6 shadow-xl max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">ランキング</h2>
                            <button onClick={() => setShowRanking(false)}><XCircle className="w-6 h-6 text-slate-400" /></button>
                        </div>
                        <div className="space-y-2">
                            {rankingData.map((r, i) => (
                                <div key={r.id} className="flex justify-between p-3 bg-slate-50 rounded border border-slate-100">
                                    <div className="flex gap-3">
                                        <div className="font-bold text-slate-400 w-6 text-center">{i + 1}</div>
                                        <div className="font-bold text-slate-900">{r.name}</div>
                                    </div>
                                    <div className="font-mono text-blue-600 font-bold">{r.points}pt</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Nickname Modal
function NicknameModal({ runId, onSave }: any) {
    const [name, setName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) return;
        setIsSaving(true);
        try {
            await updateParticipantName(runId, name);
            onSave();
        } catch (e) {
            alert('Error updating name');
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 animate-in fade-in backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm rounded-xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
                <h2 className="text-xl font-black text-center text-slate-800">👋 はじめまして！</h2>
                <p className="text-sm text-slate-500 text-center leading-relaxed">
                    ランキングに表示される<br />あなたのニックネームを教えてください。
                </p>
                <input
                    className="w-full border-2 border-slate-200 p-4 rounded-xl text-xl text-center font-bold text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-slate-300"
                    placeholder="例: タナカ"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={10}
                    autoFocus
                />
                <Button
                    className="w-full font-bold py-6 text-lg shadow-lg shadow-blue-200 transition-transform active:scale-95"
                    onClick={handleSave}
                    disabled={!name.trim() || isSaving}
                >
                    {isSaving ? '登録中...' : 'ゲームを始める'}
                </Button>
            </div>
        </div>
    );
}

// Submission Modal with Camera
function SubmissionModal({ tile, status, submission, onClose, slug, runId }: any) {
    const [mode, setMode] = useState<'menu' | 'text' | 'preview'>('menu');
    const [text, setText] = useState('');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const remaining = 140 - text.length;

    const handleSubmit = async (type: 'text' | 'photo', content: string) => {
        setIsSubmitting(true);
        try {
            await submitTile(runId, tile.id, type, content);
            await refreshGame(slug);
            onClose();
        } catch (e: any) {
            alert(e.message);
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setMode('preview');
        }
    };

    const isSecret = tile.isFixed;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:flex sm:items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl space-y-4 animate-in slide-in-from-bottom-10 duration-300 mb-safe max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                    <div>
                        <h3 className="text-3xl font-black font-serif text-slate-900">{tile.kanji}</h3>
                        <p className="text-sm text-slate-500 mt-1">{tile.description}</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"><XCircle className="w-6 h-6 text-slate-400" /></button>
                </div>

                {(tile.hint || status === 'rejected') && (
                    <div className="bg-slate-50 p-4 rounded-xl text-sm space-y-2 border border-slate-100">
                        {tile.hint && <p><strong>ヒント:</strong> {tile.hint}</p>}

                        {status === 'rejected' && (
                            <div className="text-red-600 bg-red-50 border border-red-100 p-3 rounded font-bold flex items-start gap-2">
                                <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>却下理由: {submission?.reviewNote || "条件を満たしていません。"}</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="pt-2 flex flex-col gap-3">
                    {(status === 'open' || status === 'rejected') ? (
                        <>
                            {mode === 'menu' && (
                                <>
                                    <label className="w-full group">
                                        <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
                                        <div className="bg-blue-600 text-white w-full font-bold py-4 text-lg rounded-xl flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-all shadow-md active:scale-95 group-active:scale-95">
                                            <Camera className="w-6 h-6 mr-2" /> 写真を撮る
                                        </div>
                                    </label>

                                    {isSecret && (
                                        <div className="relative flex py-2 items-center">
                                            <div className="flex-grow border-t border-slate-200"></div>
                                            <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold">または</span>
                                            <div className="flex-grow border-t border-slate-200"></div>
                                        </div>
                                    )}

                                    {isSecret && (
                                        <Button variant="secondary" className="w-full py-4 text-base" onClick={() => setMode('text')}>
                                            テキストで回答
                                        </Button>
                                    )}
                                </>
                            )}

                            {mode === 'preview' && previewUrl && (
                                <div className="space-y-4 animate-in fade-in">
                                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-black aspect-[3/4] relative shadow-inner">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex gap-3">
                                        <Button variant="secondary" className="flex-1 py-6" onClick={() => setMode('menu')}>撮り直す</Button>
                                        <Button className="flex-1 font-bold bg-blue-600 hover:bg-blue-700 text-white py-6 shadow-md" onClick={() => handleSubmit('photo', previewUrl)} disabled={isSubmitting}>
                                            {isSubmitting ? '送信中...' : 'これで送信'}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {mode === 'text' && (
                                <div className="space-y-3 animate-in fade-in">
                                    <textarea
                                        className="w-full border-2 border-slate-200 rounded-xl p-4 text-base focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-slate-300"
                                        rows={4}
                                        placeholder="回答を入力 (140文字以内)..."
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        maxLength={140}
                                        autoFocus
                                    />
                                    <div className={cn("text-xs text-right font-bold", remaining < 0 ? "text-red-500" : "text-slate-400")}>
                                        残り {remaining} 文字
                                    </div>
                                    <div className="flex gap-3">
                                        <Button variant="secondary" className="flex-1 py-4" onClick={() => setMode('menu')}>戻る</Button>
                                        <Button
                                            className="flex-1 py-4 font-bold shadow-md"
                                            disabled={remaining < 0 || text.length === 0 || isSubmitting}
                                            onClick={() => handleSubmit('text', text)}
                                        >
                                            {isSubmitting ? '送信中...' : '送信する'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-6 bg-slate-50 rounded-xl text-slate-500 font-medium border border-slate-100">
                            {status === 'pending' ? (
                                <div className="flex flex-col items-center gap-2">
                                    <Clock className="w-8 h-8 text-yellow-500 animate-pulse" />
                                    <span>現在、審査中です...</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                                    <span className="text-emerald-700 font-bold">承認されました！</span>
                                    <span className="text-xs">ポイント獲得済み</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
