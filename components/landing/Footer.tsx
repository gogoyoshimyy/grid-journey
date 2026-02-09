'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-100">

            <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <h3 className="text-xl font-black text-slate-900 font-kanji">Grid Journey</h3>
                    <p className="text-xs text-slate-400 mt-2">© 2024 Grid Journey. All rights reserved.</p>
                </div>

                <div className="flex gap-8 text-sm font-bold text-slate-600">
                    <Link href="/e/demo-bingo" className="hover:text-indigo-700 transition-colors">
                        デモイベント
                    </Link>
                    <Link href="#" className="hover:text-indigo-700 transition-colors">
                        利用規約
                    </Link>
                </div>
            </div>
        </footer>
    );
}
