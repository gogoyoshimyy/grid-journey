'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-100">
            {/* Demo Preview Section */}
            <div className="py-24 bg-[#1a1a2e] relative overflow-hidden">
                {/* Background Accents */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[100px]" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-red-600/10 blur-[100px]" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24">

                        {/* Text CTA */}
                        <div className="text-center md:text-left space-y-8 max-w-lg">
                            <h2 className="text-4xl md:text-5xl font-black text-white font-kanji leading-tight">
                                さあ、<span className="text-indigo-400">旅</span>に出よう。
                            </h2>
                            <p className="text-slate-300 text-lg leading-relaxed">
                                あなたの街も、まだ知らない「物語」で溢れている。<br />
                                誰もが探検家になれる、新しい日常へ。
                            </p>
                            <div className="pt-4">
                                <Link href="/e/demo-bingo" className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-900 font-bold rounded-full hover:bg-indigo-50 transition-all shadow-lg hover:shadow-indigo-500/20 text-lg">
                                    デモイベントを体験する
                                </Link>
                            </div>
                        </div>

                        {/* Phone Preview */}
                        <div className="relative w-[280px] h-[580px] bg-slate-900 rounded-[2.5rem] border-8 border-slate-800 shadow-2xl overflow-hidden ring-1 ring-white/10 rotate-3 hover:rotate-0 transition-all duration-500">
                            <div className="absolute inset-0 bg-slate-800">
                                {/* Screenshot Image */}
                                <img
                                    src="/images/demo-preview-mobile.png"
                                    alt="Demo Screen"
                                    className="w-full h-full object-cover"
                                />
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <h3 className="text-xl font-black text-slate-900 font-kanji">Grid Journey</h3>
                    <p className="text-xs text-slate-400 mt-2">© 2024 Grid Journey. All rights reserved.</p>
                </div>

                <div className="flex gap-8 text-sm font-bold text-slate-600">
                    <Link href="/admin" className="hover:text-indigo-700 transition-colors">
                        主催者ログイン
                    </Link>
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
