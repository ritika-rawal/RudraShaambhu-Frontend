import { Heart, Zap, Leaf } from 'lucide-react';

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

  return (
    <section id="benefits" className="py-24 px-6" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#2C1810' }}>
            Why Choose Rudraksha?
          </h2>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: '#4A3728' }}>
            Experience the transformative benefits of sacred beads
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((item, i) => (
            <div 
              key={i}
              className="p-8 rounded-2xl transition-all hover:shadow-xl"
              style={{ backgroundColor: '#FFE8C7' }}
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: '#FFFFFF' }}>
                <item.icon className="w-7 h-7" style={{ color: '#8B4513' }} />
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#2C1810' }}>
                {item.title}
              </h3>
              <p className="leading-relaxed" style={{ color: '#4A3728' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}