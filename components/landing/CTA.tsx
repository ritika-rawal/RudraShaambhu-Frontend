export default function CTA() {
  return (
    <section id="contact" className="py-24 px-6" style={{ backgroundColor: '#8B4513' }}>
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          Start Your Spiritual Journey
        </h2>
        <p className="text-xl max-w-2xl mx-auto" style={{ color: '#FFE8C7' }}>
          Discover authentic Rudraksha beads and unlock ancient wisdom
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button 
            className="px-10 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105" 
            style={{ backgroundColor: '#FFB257', color: '#2C1810' }}
          >
            Shop Collection
          </button>
        </div>
      </div>
    </section>
  );
}