import { Leaf, Star } from 'lucide-react';

export default function About() {
  const features = [
    '100% Natural and authentic',
    'Perfect for meditation',
    'Unique spiritual benefits',
    'Used for 5000+ years'
  ];

  return (
    <section id="aboutus" className="py-24 px-6" style={{ backgroundColor: '#FFD8A8' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\'%3E%3Crect fill=\'%234A3728\' width=\'100\' height=\'100\'/%3E%3C/svg%3E")' }}>
              <div className="text-center">
                <Leaf className="w-24 h-24 mx-auto mb-4" style={{ color: '#D4A574' }} />
                <p className="font-semibold text-white">Rudraksha Tree</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold" style={{ color: '#2C1810' }}>
              What is Rudraksha?
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#4A3728' }}>
              Rudraksha are sacred seeds from the Rudraksha tree, revered for thousands of years in spiritual practices. The name means "tears of Shiva" in Sanskrit.
            </p>
            <p className="text-lg leading-relaxed" style={{ color: '#4A3728' }}>
              Each bead contains natural facets called "mukhis" that hold unique properties for meditation and spiritual growth.
            </p>
            <div className="space-y-3 pt-4">
              {features.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FFB257' }}>
                    <Star className="w-4 h-4" style={{ color: '#2C1810' }} />
                  </div>
                  <span className="font-medium" style={{ color: '#2C1810' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}