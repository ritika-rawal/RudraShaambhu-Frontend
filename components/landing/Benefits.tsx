import { Heart, Zap, Leaf } from 'lucide-react';
import colors from '@/theme/colors';

export default function Benefits() {
  const benefits = [
    { 
      icon: Heart, 
      title: 'Spiritual Growth', 
      desc: 'Deepen your meditation practice and connect with your inner self through ancient spiritual wisdom.'
    },
    { 
      icon: Zap, 
      title: 'Inner Peace', 
      desc: 'Reduce stress and anxiety, achieve mental clarity and emotional balance naturally.'
    },
    { 
      icon: Leaf, 
      title: 'Positive Energy', 
      desc: 'Attract abundance and positive vibrations while protecting from negative influences.'
    }
  ];

  // Duplicate the benefits array for seamless infinite scroll
  const duplicatedBenefits = [...benefits, ...benefits];

  return (
    <section id="benefits" className="py-24 px-6 overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: colors.text }}>
            Why Choose Rudraksha?
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: colors.border }}>
            Experience the transformative benefits of sacred beads
          </p>
        </div>

        {/* Scrolling Container */}
        <div className="relative w-full overflow-hidden">
          <style jsx>{`
            @keyframes scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
            .scroll-container {
              animation: scroll 20s linear infinite;
            }
            .scroll-container:hover {
              animation-play-state: paused;
            }
          `}</style>
          
          <div className="scroll-container flex gap-8" style={{ width: 'fit-content' }}>
            {duplicatedBenefits.map((item, i) => (
              <div 
                key={i}
                className="p-8 rounded-2xl transition-all hover:shadow-xl flex-shrink-0"
                style={{ backgroundColor: colors.primary, width: '350px' }}
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: '#FFFFFF' }}>
                  <item.icon className="w-7 h-7" style={{ color: colors.dark }} />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
                  {item.title}
                </h3>
                <p className="leading-relaxed" style={{ color: colors.border }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}