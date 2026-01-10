'use client';

import React, { useState } from 'react';
import { reviewSubmission } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, XCircle, Camera, AlignLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ReviewList({ initialSubmissions }: { initialSubmissions: any[], eventId: string }) {
    const [items, setItems] = useState(initialSubmissions);
    const router = useRouter();

    const handleReview = async (id: string, status: 'approved' | 'rejected') => {
        // Optimistic removal
        setItems(prev => prev.filter(i => i.id !== id));

        try {
            await reviewSubmission(id, status, status === 'rejected' ? 'Does not meet criteria' : undefined);
            router.refresh(); // Refresh to get up-to-date points/stats if needed
        } catch (e) {
            console.error(e);
            alert("Failed to review");
            // In real app, revert optimistic update
        }
    };

    if (items.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                <p className="text-slate-500">No pending submissions.</p>
                <button onClick={() => router.refresh()} className="mt-4 text-blue-600 hover:underline">Refresh</button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {items.map(sub => (
                <div key={sub.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-600 mb-1">
                                Tile: {sub.tile.kanji}
                            </span>
                            <h3 className="font-bold text-lg">{sub.run.participantName}</h3>
                            <p className="text-xs text-slate-400">
                                {formatDistanceToNow(new Date(sub.submittedAt))} ago
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-sm font-medium text-slate-500">Attempt #{sub.attemptCount}</span>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-center min-h-[120px]">
                        {sub.kind === 'photo' ? (
                            sub.photoUrl ? (
                                <div className="relative w-full h-full min-h-[300px] bg-black rounded-lg overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={sub.photoUrl}
                                        alt="Submission"
                                        className="w-full h-full object-contain absolute inset-0"
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-slate-400">
                                    <Camera className="w-8 h-8 mb-2" />
                                    <span className="text-xs">No Photo Data</span>
                                </div>
                            )
                        ) : (
                            <div className="w-full">
                                <AlignLeft className="w-4 h-4 text-slate-400 mb-2" />
                                <p className="font-serif text-lg text-slate-800">{sub.textContent}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button variant="danger" className="flex-1" onClick={() => handleReview(sub.id, 'rejected')}>
                            <XCircle className="w-4 h-4 mr-2" /> Reject
                        </Button>
                        <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => handleReview(sub.id, 'approved')}>
                            <CheckCircle className="w-4 h-4 mr-2" /> Approve
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
