import colors from '@/theme/colors';

export default function CTA() {
  return (
    <section id="contact" className="py-24 px-6" style={{ backgroundColor: colors.dark }}>
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          Start Your Spiritual Journey
        </h2>
        <p className="text-xl max-w-2xl mx-auto" style={{ color: colors.primary }}>
          Discover authentic Rudraksha beads and unlock ancient wisdom
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button 
            className="px-10 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105" 
            style={{ backgroundColor: colors.cta, color: colors.text }}
          >
            Shop Collection
          </button>
        </div>
      </div>
    </section>
  );
}