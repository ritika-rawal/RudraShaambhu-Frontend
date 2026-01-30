"use client";

import { SetStateAction, useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import colors from '@/theme/colors';

export default function RudrakshRecommendationPage() {
  const [activeWidget, setActiveWidget] = useState<string | null>(null);
  const [formData, setFormData] = useState({ date: '', name: '' });
  const [result, setResult] = useState(null);

  const horoscopeMap = {
    'aries': { name: '3 Mukhi', price: 20, benefits: ['Confidence & Courage', 'Vitality', 'Inner Strength'] },
    'taurus': { name: '5 Mukhi', price: 15, benefits: ['Health & Vitality', 'Mental Peace', 'Protection'] },
    'gemini': { name: '4 Mukhi', price: 19, benefits: ['Creativity', 'Communication', 'Expression'] },
    'cancer': { name: '2 Mukhi', price: 18, benefits: ['Relationship Harmony', 'Balance', 'Peace'] },
    'leo': { name: '12 Mukhi', price: 38, benefits: ['Leadership & Success', 'Authority', 'Confidence'] },
    'virgo': { name: '6 Mukhi', price: 22, benefits: ['Intelligence & Wisdom', 'Focus', 'Academic Success'] },
    'libra': { name: '2 Mukhi', price: 18, benefits: ['Balance & Harmony', 'Peace', 'Justice'] },
    'scorpio': { name: '8 Mukhi', price: 28, benefits: ['Courage & Strength', 'Fearlessness', 'Power'] },
    'sagittarius': { name: '7 Mukhi', price: 25, benefits: ['Wealth & Prosperity', 'Success', 'Good Fortune'] },
    'capricorn': { name: '11 Mukhi', price: 35, benefits: ['Spiritual Growth', 'Deep Meditation', 'Divine Grace'] },
    'aquarius': { name: '9 Mukhi', price: 32, benefits: ['Emotional Balance', 'Intuition', 'Peace'] },
    'pisces': { name: '13 Mukhi', price: 42, benefits: ['Love & Attraction', 'Relationships', 'Harmony'] }
  };

  const bhagyankMap = {
    1: { name: '1 Mukhi', price: 45, benefits: ['Divine Manifestation', 'Supreme Consciousness', 'Enlightenment'] },
    2: { name: '2 Mukhi', price: 18, benefits: ['Relationship Harmony', 'Balance', 'Peace'] },
    3: { name: '3 Mukhi', price: 20, benefits: ['Confidence & Courage', 'Vitality', 'Inner Strength'] },
    4: { name: '4 Mukhi', price: 19, benefits: ['Creativity', 'Communication', 'Expression'] },
    5: { name: '5 Mukhi', price: 15, benefits: ['Health & Vitality', 'Mental Peace', 'Protection'] },
    6: { name: '6 Mukhi', price: 22, benefits: ['Intelligence & Wisdom', 'Focus', 'Academic Success'] },
    7: { name: '7 Mukhi', price: 25, benefits: ['Wealth & Prosperity', 'Success', 'Good Fortune'] },
    8: { name: '8 Mukhi', price: 28, benefits: ['Courage & Strength', 'Fearlessness', 'Power'] },
    9: { name: '9 Mukhi', price: 32, benefits: ['Emotional Balance', 'Intuition', 'Peace'] }
  };

  const getZodiac = (month: string, date: string) => {
    const signs = ['capricorn', 'aquarius', 'pisces', 'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius'];
    const daysInMonth = [20, 19, 20, 20, 21, 21, 23, 23, 23, 23, 22, 22];
    if (date < daysInMonth[month - 1]) return signs[month - 1];
    return signs[month % 12];
  };

  const calculateBhagyank = (date: string) => {
    let sum = parseInt(date);
    while (sum > 9) sum = Math.floor(sum / 10) + (sum % 10);
    return sum;
  };

  const calculateNameNumerology = (text: string) => {
    const map = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9, s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8 };
    let sum = 0;
    text.toLowerCase().split('').forEach(char => { if (map[char]) sum += map[char]; });
    while (sum > 9) sum = Math.floor(sum / 10) + (sum % 10);
    return sum;
  };

  const handleWidgetClick = (type: string) => {
    setActiveWidget(type);
    setResult(null);
  };

  const handleGetRecommendation = (type: string) => {
    if (type === 'horoscope' && !formData.date) {
      alert('Please enter your birth date');
      return;
    }
    if (type === 'name' && !formData.name) {
      alert('Please enter your name');
      return;
    }

    let recommendation;
    if (type === 'horoscope') {
      const [year, month, date] = formData.date.split('-');
      const zodiac = getZodiac(month, date);
      recommendation = { ...horoscopeMap[zodiac], type: 'Horoscope', label: zodiac.charAt(0).toUpperCase() + zodiac.slice(1) };
    } else if (type === 'bhagyank') {
      const [year, month, date] = formData.date.split('-');
      const bhagyank = calculateBhagyank(date);
      recommendation = { ...bhagyankMap[bhagyank], type: 'Bhagyank', label: `Lucky Number ${bhagyank}` };
    } else {
      const nameNum = calculateNameNumerology(formData.name);
      recommendation = { ...bhagyankMap[nameNum], type: 'Name Numerology', label: `Numerology ${nameNum}` };
    }

    setResult(recommendation);
  };

  const handleClose = () => {
    setActiveWidget(null);
    setResult(null);
    setFormData({ date: '', name: '' });
  };

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(135deg, #FFF9F0 0%, ${colors.primary} 100%)` }}>
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-2xl font-bold mb-6" style={{ color: colors.text }}>
            Find Your Rudraksha
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: colors.border }}>
            Choose one of three ways to discover your perfect Rudraksha based on your horoscope, lucky number, or name.
          </p>
        </div>
      </section>

      {/* 3 Widgets */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Widget 1: Horoscope */}
          <div
            onClick={() => handleWidgetClick('horoscope')}
            className="rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer text-center"
            style={{ backgroundColor: '#FFFFFF', border: `3px solid ${colors.accent}` }}
          >
            <div className="text-5xl mb-4">🌙</div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: colors.text }}>
              By Your Horoscope
            </h3>
            <p style={{ color: colors.border }}>
              Enter your birth date to find your zodiac sign's perfect Rudraksha
            </p>
          </div>

          {/* Widget 2: Bhagyank */}
          <div
            onClick={() => handleWidgetClick('bhagyank')}
            className="rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer text-center"
            style={{ backgroundColor: '#FFFFFF', border: `3px solid ${colors.accent}` }}
          >
            <div className="text-5xl mb-4">🔢</div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: colors.text }}>
              By Your Bhagyank
            </h3>
            <p style={{ color: colors.border }}>
              Your birth date reveals your lucky number and its Rudraksha
            </p>
          </div>

          {/* Widget 3: Name */}
          <div
            onClick={() => handleWidgetClick('name')}
            className="rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer text-center"
            style={{ backgroundColor: '#FFFFFF', border: `3px solid ${colors.accent}` }}
          >
            <div className="text-5xl mb-4">✍️</div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: colors.text }}>
              By Your Name
            </h3>
            <p style={{ color: colors.border }}>
              Your name's numerology reveals your perfect Rudraksha match
            </p>
          </div>
        </div>
      </section>

      {/* Modal */}
      {activeWidget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold" style={{ color: colors.text }}>
                {activeWidget === 'horoscope' && 'Your Horoscope'}
                {activeWidget === 'bhagyank' && 'Your Bhagyank'}
                {activeWidget === 'name' && 'Your Name'}
              </h3>
              <button
                onClick={handleClose}
                className="text-2xl font-bold"
                style={{ color: colors.dark }}
              >
                ✕
              </button>
            </div>

            {!result ? (
              <>
                <div className="space-y-4 mb-6">
                  {(activeWidget === 'horoscope' || activeWidget === 'bhagyank') && (
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                      style={{ borderColor: colors.accent, color: colors.text }}
                    />
                  )}
                  {activeWidget === 'name' && (
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none"
                      style={{ borderColor: colors.accent, color: colors.text }}
                    />
                  )}
                </div>

                <button
                  onClick={() => handleGetRecommendation(activeWidget)}
                  className="w-full py-3 rounded-lg font-bold text-white transition-all hover:scale-105"
                  style={{ backgroundColor: colors.dark }}
                >
                  Get Recommendation
                </button>
              </>
            ) : (
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold" style={{ color: colors.dark }}>
                    {result.label}
                  </p>
                  <h4 className="text-3xl font-bold mt-2" style={{ color: colors.text }}>
                    {result.name} Rudraksha
                  </h4>
                  <p className="text-lg font-semibold mt-2" style={{ color: colors.accent }}>
                    ${result.price}
                  </p>
                </div>

                <div>
                  <p className="font-semibold mb-3" style={{ color: colors.text }}>
                    Benefits:
                  </p>
                  <div className="space-y-2">
                    {result.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span>✨</span>
                        <span style={{ color: colors.border }}>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    className="flex-1 py-3 rounded-lg font-bold transition-all"
                    style={{ backgroundColor: colors.accent, color: colors.text }}
                  >
                    Back
                  </button>
                  <button
                    className="flex-1 py-3 rounded-lg font-bold text-white transition-all"
                    style={{ backgroundColor: colors.dark }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer  />
    </div>
  );
}