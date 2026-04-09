"use client";

import Image from 'next/image';
import { useCurrency } from '@/components/common/CurrencyProvider';
import colors from '@/theme/colors';
import { getMukhiImageSrc } from '@/lib/mukhiImages';

export default function Featured() {
  const { formatPrice } = useCurrency();
  const collections = [
    { name: '1 Mukhi', mukhi: 1, price: 45, desc: 'Power & manifestation' },
    { name: '5 Mukhi', mukhi: 5, price: 15, desc: 'Health & protection' },
    { name: '7 Mukhi', mukhi: 7, price: 25, desc: 'Wealth & prosperity' },
    { name: '11 Mukhi', mukhi: 11, price: 35, desc: 'Spiritual growth' }
  ];

  return (
    <section className="py-24 px-6" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: colors.text }}>
            Featured Collections
          </h2>
          <p className="text-xl" style={{ color: colors.border }}>
            Premium quality Rudraksha for every spiritual practice
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6">
          {collections.map((item, i) => (
            <div 
              key={i} 
              className="rounded-xl p-6 text-center transition-all hover:shadow-lg" 
              style={{ backgroundColor: colors.primary }}
            >
              <div className="relative mb-4 h-28 w-full overflow-hidden rounded-lg bg-white/70">
                <Image
                  src={getMukhiImageSrc(item.mukhi)}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>
                {item.name}
              </h3>
              <p className="mb-4 text-sm" style={{ color: colors.border }}>
                {item.desc}
              </p>
              <p className="text-3xl font-bold" style={{ color: colors.dark }}>
                {formatPrice(item.price)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}