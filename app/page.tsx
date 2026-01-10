
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight font-kanji">フォト漢字ビンゴ</h1>
        <p className="text-slate-600 font-medium">MVP プロトタイプ</p>
      </div>

      <div className="grid gap-4 w-full max-w-sm">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
          <h2 className="font-bold text-lg text-slate-700">参加者の方はこちら</h2>
          <Link href="/e/demo-bingo" className="block w-full">
            <Button className="w-full text-lg h-14 font-bold" variant="primary">
              デモイベントに参加
            </Button>
          </Link>
          <p className="text-xs text-center text-slate-400">イベントID: demo-bingo</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
          <h2 className="font-bold text-lg text-slate-700">主催者の方はこちら</h2>
          <Link href="/admin" className="block w-full">
            <Button variant="secondary" className="w-full font-bold">
              管理画面へ
            </Button>
          </Link>
        </div>

        <div className="bg-slate-100 p-4 rounded-xl text-center space-y-2">
          <p className="text-xs font-mono text-slate-500">初回セットアップ (開発用)</p>
          <Link href="/api/seed" target="_blank" className="text-blue-600 text-sm font-bold hover:underline">
            初期データを投入 (/api/seed)
          </Link>
        </div>
      </div>
    </div>
  );
}
