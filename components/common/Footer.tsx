import colors from '@/theme/colors';

type FooterProps = {
  variant?: 'full' | 'simple';
};

export default function Footer({ variant = 'full' }: FooterProps) {
  if (variant === 'simple') {
    return (
      <footer className="py-12 px-6 mt-16" style={{ backgroundColor: colors.footerBg }}>
        <div className="max-w-7xl mx-auto text-center">
          <p style={{ color: colors.accent }}>
            &copy; 2026 Rudra Shaambhu. Find your perfect Rudraksha. 🙏
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="py-16 px-6" style={{ backgroundColor: colors.footerBg }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold text-white">Rudra Shaambhu</span>
            </div>
            <p className="text-lg" style={{ color: colors.accent }}>
              Authentic spiritual beads for meditation, healing, and inner peace.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4 text-lg">Quick Links</h4>
            <div className="space-y-2">
              <a href="#aboutus" className="block transition text-base" style={{ color: colors.accent }}>About Us</a>
              <a href="#benefits" className="block transition text-base" style={{ color: colors.accent }}>Benefits</a>
              <a href="#" className="block transition text-base" style={{ color: colors.accent }}>Store</a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4 text-lg">Connect</h4>
            <div className="space-y-2">
              <a href="#" className="block transition text-base" style={{ color: colors.accent }}>Contact</a>
              <a href="#" className="block transition text-base" style={{ color: colors.accent }}>FAQ</a>
              <a href="#" className="block transition text-base" style={{ color: colors.accent }}>Newsletter</a>
            </div>
          </div>
        </div>

        <div className="border-t pt-4 text-center" style={{ borderColor: colors.border }}>
          <p style={{ color: colors.accent }}>&copy; 2026 Rudra Shaambhu. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
