'use client';

import { motion } from 'framer-motion';
import { MapPin, Calculator, Users, BookOpen } from 'lucide-react';

const features = [
    {
        icon: MapPin,
        title: "スポットミッション",
        desc: "漢字だけでなく、場所や体験もミッションに。店舗への来店やアクティビティ参加を促し、観光客の行動を自然にデザインします。"
    },
    {
        icon: Calculator,
        title: "戦略的なスコアリング",
        desc: "ミッション、ビンゴ、そして「芸術点」。制限時間内にどう回るか？シンプルかつ奥深い戦略性が、熱中するゲーム体験を生みます。"
    },
    {
        icon: Users,
        title: "チームでも、一人でも",
        desc: "一人旅の散策から、チーム対抗の修学旅行・企業研修まで。参加人数や目的に合わせて、最適な遊び方を提供します。"
    },
    {
        icon: BookOpen,
        title: "デジタルコレクション",
        desc: "獲得した漢字やスポットは、デジタル御朱印帳のように記録。旅の思い出をコレクションとして、いつでも振り返ることができます。"
    }
];

export default function Features() {
    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-4">

                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 font-kanji mb-4">
                        より没入できる観光体験を。
                    </h2>
                    <p className="text-slate-600">
                        街歩きが、発見の旅に変わる。
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm hover:border-indigo-100 hover:shadow-md transition-all"
                        >
                            <feature.icon className="w-10 h-10 text-indigo-900 mb-4" />
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
