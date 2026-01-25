"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Menu, X, Heart, Shield, Sparkles, ChevronRight, Leaf, Star, Droplets, Zap } from 'lucide-react';

const RudrakshaSite = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FFF9F0 0%, #FFE8C7 50%, #FFD8A8 100%)' }}>
      {/* Navigation */}
      <nav className="fixed w-full backdrop-blur-md shadow-lg z-50" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #FFD8A8 0%, #FFE8C7 100%)' }}>
                <Sparkles className="w-6 h-6 text-amber-900" />
              </div>
              <span className="text-2xl font-bold text-amber-900">
                Rudraksha
              </span>
            </div>
            
            <div className="hidden md:flex gap-10">
              {['Home', 'Benefits', 'About', 'Contact'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className={`text-amber-800 hover:font-semibold transition-all text-base`}
                >
                  {item}
                </a>
              ))}
            </div>

            <button 
              className="md:hidden text-amber-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t" style={{ backgroundColor: 'rgba(255, 255, 255, 0.98)' }}>
            <div className="px-6 py-4 space-y-3">
              {['Home', 'Benefits', 'About', 'Contact'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className="block text-amber-800 hover:font-semibold"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center min-h-[80vh]">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-6xl md:text-7xl font-bold text-amber-900 leading-tight">
                  Discover Sacred
                  <span className="block" style={{ color: '#D4860B' }}>Rudraksha Beads</span>
                </h1>
              </div>
              <p className="text-xl text-amber-800 leading-relaxed max-w-lg">
                Experience thousands of years of spiritual wisdom through authentic Rudraksha beads. Transform your meditation practice and connect with divine energy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="px-8 py-4 text-white rounded-xl font-semibold text-lg hover:shadow-2xl transition-all hover:scale-105 active:scale-95" style={{ background: 'linear-gradient(135deg, #FFD8A8 0%, #FFE8C7 100%)' }}>
                  Explore Collection
                </button>
                <button className="px-8 py-4 border-2 text-amber-900 rounded-xl font-semibold text-lg hover:shadow-xl transition-all" style={{ borderColor: '#FFD8A8', color: '#6B4423' }}>
                  Learn More
                </button>
              </div>
            </div>

            <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500" style={{ border: '8px solid #FFE8C7' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-amber-200 via-orange-100 to-yellow-100 flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="w-24 h-24 mx-auto text-amber-700 mb-4" />
                  <p className="text-amber-900 font-semibold">Sacred Rudraksha Image</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section with Hover Effect */}
      <section id="benefits" className="py-24 px-6" style={{ background: 'linear-gradient(180deg, #FFF9F0 0%, #FFE8C7 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-amber-900 mb-6">
              Why Choose Rudraksha?
            </h2>
            <p className="text-xl text-amber-800 max-w-2xl mx-auto">
              Experience the transformative benefits of sacred beads used for thousands of years
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: Heart, 
                title: 'Spiritual Growth', 
                desc: 'Deepen your meditation practice and connect with your inner self through ancient spiritual wisdom and divine connection.'
              },
              { 
                icon: Zap, 
                title: 'Inner Peace', 
                desc: 'Reduce stress and anxiety, achieve mental clarity and emotional balance with natural calming properties.'
              },
              { 
                icon: Leaf, 
                title: 'Positive Energy', 
                desc: 'Attract abundance and positive vibrations while protecting yourself from negative influences.'
              }
            ].map((item, i) => (
              <div 
                key={i}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
                className="relative p-10 rounded-3xl cursor-pointer transition-all duration-500 ease-out transform hover:shadow-2xl"
                style={{
                  background: hoveredCard === i 
                    ? 'linear-gradient(135deg, #D4860B 0%, #FFD8A8 100%)' 
                    : 'linear-gradient(135deg, rgba(255, 216, 168, 0.3) 0%, rgba(255, 232, 199, 0.3) 100%)',
                  border: '2px solid #FFD8A8',
                  transform: hoveredCard === i ? 'translateY(-12px) scale(1.05)' : 'translateY(0) scale(1)'
                }}
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500" style={{
                  background: hoveredCard === i ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 232, 199, 0.6)',
                  color: hoveredCard === i ? '#FFFFFF' : '#8B5A1C'
                }}>
                  <item.icon className={`w-8 h-8 transition-transform duration-500 ${hoveredCard === i ? 'scale-125' : 'scale-100'}`} />
                </div>
                
                <h3 className={`text-2xl font-bold mb-4 transition-colors duration-500 ${
                  hoveredCard === i ? 'text-white' : 'text-amber-900'
                }`}>
                  {item.title}
                </h3>
                
                <p className={`leading-relaxed text-base transition-colors duration-500 ${
                  hoveredCard === i ? 'text-amber-50' : 'text-amber-800'
                }`}>
                  {item.desc}
                </p>

                {hoveredCard === i && (
                  <div className="mt-6 flex items-center text-white font-semibold">
                    Learn More
                    <ChevronRight className="w-5 h-5 ml-2 animate-bounce" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6" style={{ background: 'linear-gradient(135deg, #FFF9F0 0%, #FFE8C7 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl" style={{ border: '8px solid #FFD8A8' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-amber-200 via-orange-100 to-yellow-100 flex items-center justify-center">
                <div className="text-center">
                  <Leaf className="w-24 h-24 mx-auto text-amber-700 mb-4" />
                  <p className="text-amber-900 font-semibold">Rudraksha Tree & Beads</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <h2 className="text-5xl font-bold text-amber-900">
                What is Rudraksha?
              </h2>
              <div className="space-y-6">
                <p className="text-lg text-amber-800 leading-relaxed">
                  Rudraksha are sacred seeds from the Rudraksha tree, revered for thousands of years in spiritual practices. The name means "tears of Shiva" in Sanskrit, symbolizing divine blessings.
                </p>
                <p className="text-lg text-amber-800 leading-relaxed">
                  Each bead contains natural facets called "mukhis" that hold unique properties and benefits for meditation, spiritual growth, healing, and well-being.
                </p>
              </div>
              <div className="space-y-4 pt-6">
                {[
                  '100% Natural and authentic seeds',
                  'Perfect for meditation and prayer',
                  'Each mukhi has unique spiritual benefits',
                  'Used by spiritual seekers for 5000+ years',
                  'Scientifically proven calming properties'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #FFD8A8 0%, #FFE8C7 100%)' }}>
                      <Star className="w-5 h-5 text-amber-900" />
                    </div>
                    <span className="text-amber-800 font-medium text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
Featured Section */
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-amber-900 mb-4">Featured Collections</h2>
            <p className="text-xl text-amber-800">Premium quality Rudraksha for every spiritual practice</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: '1 Mukhi', price: '$45', desc: 'Ultimate power & manifestation' },
              { name: '5 Mukhi', price: '$15', desc: 'Health & protection' },
              { name: '7 Mukhi', price: '$25', desc: 'Wealth & prosperity' },
              { name: '11 Mukhi', price: '$35', desc: 'Peace & spiritual growth' }
            ].map((item, i) => (
              <div key={i} className="rounded-2xl p-6 text-center hover:shadow-2xl transition-all transform hover:scale-105" style={{
                background: 'linear-gradient(135deg, rgba(255, 216, 168, 0.4) 0%, rgba(255, 232, 199, 0.4) 100%)',
                border: '2px solid #FFD8A8'
              }}>
                <div className="mb-4">
                  <Droplets className="w-12 h-12 mx-auto text-amber-800" />
                </div>
                <h3 className="text-2xl font-bold text-amber-900 mb-2">{item.name}</h3>
                <p className="text-amber-700 mb-4">{item.desc}</p>
                <p className="text-3xl font-bold text-amber-900">{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-24 px-6" style={{ background: 'linear-gradient(135deg, #FFD8A8 0%, #FFE8C7 100%)' }}>
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-5xl md:text-6xl font-bold text-amber-950">
            Start Your Spiritual Journey
          </h2>
          <p className="text-2xl text-amber-900 max-w-2xl mx-auto">
            Discover authentic Rudraksha beads and unlock the wisdom of ancient traditions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button className="px-10 py-4 bg-white text-amber-900 rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105 active:scale-95">
              Shop Collection
            </button>
            <button className="px-10 py-4 border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all">
              Get Free Guide
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6" style={{ backgroundColor: '#6B4423' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-8 h-8 text-yellow-300" />
                <span className="text-2xl font-bold text-white">Sacred Rudraksha</span>
              </div>
              <p className="text-amber-100 text-lg">
                Authentic spiritual beads for meditation, healing, and inner peace. Trusted by spiritual seekers worldwide.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4 text-lg">Quick Links</h4>
              <div className="space-y-3">
                <a href="#about" className="block text-amber-100 hover:text-white transition text-base">About Us</a>
                <a href="#benefits" className="block text-amber-100 hover:text-white transition text-base">Benefits</a>
                <a href="#" className="block text-amber-100 hover:text-white transition text-base">Store</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4 text-lg">Connect</h4>
              <div className="space-y-3">
                <a href="#" className="block text-amber-100 hover:text-white transition text-base">Contact</a>
                <a href="#" className="block text-amber-100 hover:text-white transition text-base">FAQ</a>
                <a href="#" className="block text-amber-100 hover:text-white transition text-base">Newsletter</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-yellow-700 pt-8 text-center">
            <p className="text-amber-100">&copy; 2026 Sacred Rudraksha. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};


export default RudrakshaSite;