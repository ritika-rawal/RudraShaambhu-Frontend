import Image from 'next/image';
import Link from 'next/link';
import colors from '@/theme/colors';

export default function Hero() {
  return (
    <section id="home" className="pt-30 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Text */}
          <div className="space-y-7">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight" style={{ color: colors.text }}>
              Find the Right Rudraksha, Effortlessly
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: colors.text }}>
              We believe spiritual tools should be chosen with care, not impulse. That's why every Rudraksha Rudra Shambhu offer is guided, verified, and handled with intention.
            </p>
            <Link href="/explore">
              <button
                className="px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: colors.cta, color: colors.text }}
              >
                Explore More
              </button>
            </Link>
          </div>

          {/* Right Image */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-[700px] h-[400px] md:h-[500px]">
              <Image
                src="/first.png"
                alt="Sacred Rudraksha"
                fill
                className="rounded-2xl object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}