import { Leaf, Star } from 'lucide-react';
import Image from 'next/image';
import colors from '@/theme/colors';

export default function About() {
  const features = [
    '100% Natural and authentic',
    'Perfect for meditation',
    'Unique spiritual benefits',
    'Used for 5000+ years'
  ];

  return (
    <section id="aboutus" className="py-24 px-6" style={{ backgroundColor: colors.accent }}>
  <div className="max-w-6xl mx-auto">
    <div className="grid md:grid-cols-2 gap-12 items-center">

      {/* LEFT: Image */}
      <div className="relative h-[350px] w-full rounded-2xl overflow-hidden shadow-xl">
        <Image
          src="/tree.jpg"
          alt="Rudraksha Tree"
          fill
          className="object-cover"
        />
      </div>

      {/* RIGHT: Content */}
      <div className="space-y-6">
        <h2 className="text-4xl md:text-5xl font-bold" style={{ color: colors.text }}>
          What is Rudraksha?
        </h2>

        <p className="text-lg leading-relaxed" style={{ color: colors.border }}>
          Rudraksha are sacred seeds from the Rudraksha tree, revered for thousands of years in spiritual practices. The name means "tears of Shiva" in Sanskrit.
        </p>

        <p className="text-lg leading-relaxed" style={{ color: colors.border }}>
          Each bead contains natural facets called "mukhis" that hold unique properties for meditation and spiritual growth.
        </p>

        <div className="space-y-3 pt-4">
          {features.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: colors.cta }}
              >
                <Star className="w-4 h-4" style={{ color: colors.text }} />
              </div>
              <span className="font-medium" style={{ color: colors.text }}>
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>
</section>

  );
}