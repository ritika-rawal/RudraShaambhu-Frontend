import { Droplets } from 'lucide-react';

export default function Featured() {
  const collections = [
    { name: '1 Mukhi', price: '$45', desc: 'Power & manifestation' },
    { name: '5 Mukhi', price: '$15', desc: 'Health & protection' },
    { name: '7 Mukhi', price: '$25', desc: 'Wealth & prosperity' },
    { name: '11 Mukhi', price: '$35', desc: 'Spiritual growth' }
  ];

  return (
    <section className="py-24 px-6" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#2C1810' }}>
            Featured Collections
          </h2>
          <p className="text-xl" style={{ color: '#4A3728' }}>
            Premium quality Rudraksha for every spiritual practice
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6">
          {collections.map((item, i) => (
            <div 
              key={i} 
              className="rounded-xl p-6 text-center transition-all hover:shadow-lg" 
              style={{ backgroundColor: '#FFE8C7' }}
            >
              <div className="mb-4">
                <Droplets className="w-12 h-12 mx-auto" style={{ color: '#8B4513' }} />
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#2C1810' }}>
                {item.name}
              </h3>
              <p className="mb-4 text-sm" style={{ color: '#4A3728' }}>
                {item.desc}
              </p>
              <p className="text-3xl font-bold" style={{ color: '#8B4513' }}>
                {item.price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}