'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, MapPin, Grid3X3 } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-[#FDFCF8] text-[#1a1a1a]">
      {/* Background Pattern - Seigaiha or similar subtle pattern could be added here */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

      {/* Accent Circles */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-red-600/5 blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-indigo-900/5 blur-[80px]" />

      <div className="container relative mx-auto px-4 z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:w-1/2 space-y-8 text-center lg:text-left"
        >
          <div className="inline-block px-4 py-1.5 rounded-full border border-indigo-900/10 bg-white/50 backdrop-blur-sm text-indigo-900 text-sm font-bold tracking-wider">
            漢字×街歩きミッション
          </div>

          <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tight font-kanji text-slate-900">
            歩くほど、<br />
            旅が<span className="text-indigo-700">深くなる</span>。
          </h1>

          <div className="space-y-4 max-w-2xl mx-auto lg:mx-0">
            <p className="text-lg lg:text-xl text-slate-600 font-medium leading-relaxed">
              漢字をヒントに歩くと、同じ景色が少し違って見える。<br />
              名所も路地も、あなたの一枚が旅の記録になる。
            </p>
            <p className="text-base text-slate-500 leading-relaxed">
              旅の気づきを、ビンゴに集めていく。<br />
              スポンサーミッションでご当地ボーナス、時間で新しいお題が開くことも。
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link href="/e/demo-bingo" className="group relative px-8 py-4 bg-indigo-900 text-white font-bold rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all">
              <div className="absolute inset-0 w-full h-full bg-white/10 group-hover:bg-white/20 transition-all" />
              <span className="relative flex items-center gap-2">
                デモに参加 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link href="/admin" className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-all flex items-center gap-2">
              主催者として作成
            </Link>
          </div>
        </motion.div>

        {/* Visual Content: Grid Overlay Effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="lg:w-1/2 relative"
        >
          {/* Phone Frame */}
          <div className="relative z-10 mx-auto w-[300px] h-[600px] bg-slate-900 rounded-[3rem] border-8 border-slate-800 shadow-2xl overflow-hidden ring-1 ring-white/20">
            {/* Screen Content */}
            <div className="absolute inset-0 bg-slate-100 flex flex-col">
              {/* Camera View Placeholder */}
              <div className="relative flex-1 bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-sakurajima.png')" }}>
                <div className="absolute inset-0 bg-black/10" />

                {/* AR Grid Overlay */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-4 p-4 gap-2">
                  {/* Highlighted Box */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, borderColor: "transparent" }}
                    animate={{ opacity: 1, scale: 1, borderColor: "#dc2626" }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                    className="col-start-2 row-start-2 border-4 border-red-600 rounded-lg flex items-center justify-center backdrop-blur-sm bg-white/20 shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                  >
                    <span className="text-4xl font-black text-white drop-shadow-md">煙</span>
                  </motion.div>
                </div>

                {/* UI Overlay */}
                <div className="absolute bottom-8 left-0 right-0 px-6 text-center">
                  <div className="bg-white/90 backdrop-blur rounded-xl p-4 shadow-lg border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">ターゲット</p>
                    <p className="text-2xl font-black text-slate-900">「煙」を探せ</p>
                    <div className="flex items-center justify-center gap-2 mt-2 text-xs text-indigo-700 font-bold">
                      <MapPin className="w-3 h-3" />
                      <span>鹿児島市 エリア</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Abstract Elements behind phone */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
            className="absolute md:top-[10%] top-[20%] left-0 md:left-[10%] w-[320px] h-[320px] border border-dashed border-indigo-200 rounded-full z-0"
          />
          <div className="absolute bottom-[20%] right-[10%] z-20 bg-white p-4 rounded-xl shadow-xl border-l-4 border-l-yellow-500 animate-bounce-slow">
            <div className="flex items-start gap-4">
              <div className="bg-yellow-50 p-2 rounded-lg text-yellow-600">
                <Grid3X3 className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 mb-1">ポイント獲得</p>
                <p className="text-3xl font-black text-slate-900 leading-none mb-1">+30<span className="text-sm font-bold ml-1">pt</span></p>
                <p className="text-xs font-medium text-slate-400">スポット：桜島</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
