'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const cases = [
    {
        title: "賑わいの天文館",
        location: "鹿児島・天文館",
        mission: "「賑」を探せ",
        desc: "南九州最大の繁華街。アーケードの看板、路地裏の赤提灯… 活気あふれる街の「賑わい」の中から、ユニークな文字を見つけ出す。",
        tags: ["ショッピング", "グルメ"],
        image: "/images/kagoshima-tenmonkan.png"
    },
    {
        title: "神秘の霧島神宮",
        location: "鹿児島・霧島神宮",
        mission: "「神」を探せ",
        desc: "神話の息づく森。朱塗りの鳥居や樹齢数百年の杉… 荘厳な空気の中で、歴史に刻まれた「神」の気配を感じる旅。",
        tags: ["自然", "歴史"],
        image: "/images/kagoshima-kirishima.png"
    },
    {
        title: "雄大な仙巌園",
        location: "鹿児島・仙巌園",
        mission: "「風」を探せ",
        desc: "桜島を築山に、錦江湾を池に見立てた雄大な庭園。殿様が愛した風景の中で、心地よい「風」と薩摩の文化に出会う。",
        tags: ["文化", "絶景"],
        image: "/images/kagoshima-senganen.png"
    }
];

export default function UseCases() {
    return (
        <section className="py-24 bg-[#1a1a1a] text-white">
            <div className="container mx-auto px-4">

                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <span className="text-red-500 font-bold tracking-widest text-sm mb-2 block">活用事例</span>
                        <h2 className="text-3xl md:text-5xl font-black font-kanji">
                            旅の<span className="text-indigo-400">解像度</span>を上げる。
                        </h2>
                    </div>
                    <p className="text-gray-400 max-w-md text-sm md:text-base">
                        有名な観光地も、視点（グリッド）を変えるだけで、
                        まったく新しい冒険の舞台に変わります。
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {cases.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="group cursor-pointer"
                        >
                            <div className="relative overflow-hidden rounded-xl aspect-[3/4] mb-6">
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all z-10" />
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute bottom-4 left-4 z-20">
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full inline-block text-xs font-bold mb-2">
                                        {item.mission}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs text-gray-500 font-bold">
                                    <span>{item.location}</span>
                                    <div className="flex gap-2">
                                        {item.tags.map(tag => <span key={tag}>#{tag}</span>)}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold group-hover:text-indigo-400 transition-colors">{item.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed box-border border-l-2 border-gray-700 pl-3">
                                    {item.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
