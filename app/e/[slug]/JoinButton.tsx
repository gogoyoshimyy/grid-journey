'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function JoinButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            size="lg"
            className="w-full text-lg shadow-blue-200 shadow-lg font-bold"
            disabled={pending}
        >
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    参加準備中...
                </>
            ) : (
                'イベントに参加する'
            )}
        </Button>
    );
}
