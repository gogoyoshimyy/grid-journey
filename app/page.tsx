import Hero from '@/components/landing/Hero';
import Concept from '@/components/landing/Concept';
import Features from '@/components/landing/Feature';
import UseCases from '@/components/landing/UseCase';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900">
      <Hero />
      <Concept />
      <UseCases />
      <Features />

      {/* Call to Action Section */}
      <section className="py-24 bg-indigo-900 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-black font-kanji mb-6">さあ、旅に出よう。</h2>
          <p className="text-indigo-200 mb-10 text-lg">
            あなたの街も、まだ知らない「物語」で溢れている。
          </p>
          <a
            href="/e/demo-bingo"
            className="inline-block bg-white text-indigo-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 hover:scale-105 transition-all shadow-xl"
          >
            デモイベントを体験する
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
