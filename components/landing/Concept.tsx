'use client';

import { motion } from 'framer-motion';
import { Camera, ScrollText, Sparkles, Search, Grid3X3, BookOpen } from 'lucide-react';

const steps = [
    {
        icon: Search,
        title: "1. 探す",
        desc: "グリッドに示された漢字を、風景の中から探し出しましょう。看板、石碑、暖簾、自然…あなたの感性でその漢字にあった風景を見つけてください。",
        color: "bg-indigo-50 text-indigo-700"
    },
    {
        icon: Camera,
        title: "2. 撮る",
        desc: "あなたが見つけた「漢字」を撮影。AI、または主催者が判定し、認められたらグリッドが埋まっていきます。自分だけの「漢字コレクション」が完成します。",
        color: "bg-red-50 text-red-700"
    },
    {
        icon: Grid3X3,
        title: "3. 揃える",
        desc: "グリッドが埋められたらポイント獲得。さらに縦・横・斜めが揃うとビンゴボーナスも。独自の発想力が込められた写真なら「芸術点」も入るかも？",
        color: "bg-amber-50 text-amber-700"
    },
    {
        icon: BookOpen,
        title: "4. 知る",
        desc: "街中を歩き回って被写体を見つけることで、その場所にまつわる歴史や知識を自然と深く知ることができます。",
        color: "bg-emerald-50 text-emerald-700"
    }
];

export default function Concept() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-bold mb-6"
                    >
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        <span>コンセプト</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-black text-slate-900 mb-6 font-kanji"
                    >
                        街の日常が、<br />
                        被写体になる。
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-600 leading-relaxed"
                    >
                        観光ガイドに載っていた情報は忘れてしまうけれど、<br className="hidden md:block" />
                        自分の足で歩き、自分の目で見つけた場所の記憶は残り続けます。<br />
                        Grid Journeyは、観光地をより楽しく、より深く、<br className="hidden md:block" />知ることができる観光ゲームアプリです。
                    </motion.p>
                </div>


                {/* Steps Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-slate-100 -z-10" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-center relative group"
                        >
                            <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 ${step.color} group-hover:scale-110 transition-transform duration-300`}>
                                <step.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                            <p className="text-slate-600 leading-relaxed text-sm">
                                {step.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
