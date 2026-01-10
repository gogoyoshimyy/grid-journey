
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Photo x Kanji Bingo</h1>
        <p className="text-slate-600 font-medium">MVP Prototype</p>
      </div>

      <div className="grid gap-4 w-full max-w-sm">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
          <h2 className="font-bold text-lg">For Participants</h2>
          <Link href="/e/demo-bingo" className="block w-full">
            <Button className="w-full text-lg h-14" variant="primary">
              Join Demo Event
            </Button>
          </Link>
          <p className="text-xs text-center text-slate-400">Slug: demo-bingo</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
          <h2 className="font-bold text-lg">For Organizer</h2>
          <Link href="/admin" className="block w-full">
            <Button variant="secondary" className="w-full">
              Admin Dashboard
            </Button>
          </Link>
        </div>

        <div className="bg-slate-100 p-4 rounded-xl text-center space-y-2">
          <p className="text-xs font-mono text-slate-500">First time setup?</p>
          <Link href="/api/seed" target="_blank" className="text-blue-600 text-sm font-bold hover:underline">
            Run /api/seed
          </Link>
        </div>
      </div>
    </div>
  );
}
