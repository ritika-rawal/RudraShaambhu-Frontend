"use client";

import { useState } from 'react';
import { Menu, X, Heart, Star, Zap, Leaf, ShoppingCart, ArrowLeft, Filter } from 'lucide-react';
import Link from 'next/link';

export default function ExplorePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const products = [
    {
      id: 1,
      name: '1 Mukhi Rudraksha',
      price: 45,
      category: 'rare',
      desc: 'Most powerful - Unity of consciousness',
      benefits: ['Divine manifestation', 'Supreme consciousness', 'Enlightenment'],
      rating: 5
    },
    {
      id: 2,
      name: '5 Mukhi Rudraksha',
      price: 15,
      category: 'popular',
      desc: 'Most common - Balance & peace',
      benefits: ['Health & vitality', 'Mental peace', 'Protection'],
      rating: 5
    },
    {
      id: 3,
      name: '7 Mukhi Rudraksha',
      price: 25,
      category: 'popular',
      desc: 'Lakshmi Rudraksha - Prosperity',
      benefits: ['Wealth & prosperity', 'Success', 'Good fortune'],
      rating: 4.8
    },
    {
      id: 4,
      name: '11 Mukhi Rudraksha',
      price: 35,
      category: 'premium',
      desc: 'Highest spiritual path',
      benefits: ['Spiritual growth', 'Deep meditation', 'Divine grace'],
      rating: 4.9
    },
    {
      id: 5,
      name: '3 Mukhi Rudraksha',
      price: 20,
      category: 'popular',
      desc: 'Agni Rudraksha - Fire energy',
      benefits: ['Confidence & courage', 'Vitality', 'Inner strength'],
      rating: 4.7
    },
    {
      id: 6,
      name: '6 Mukhi Rudraksha',
      price: 22,
      category: 'premium',
      desc: 'Knowledge & learning',
      benefits: ['Intelligence & wisdom', 'Focus', 'Academic success'],
      rating: 4.8
    },
    {
      id: 7,
      name: '8 Mukhi Rudraksha',
      price: 28,
      category: 'premium',
      desc: 'Shiva Rudraksha - Power',
      benefits: ['Courage & strength', 'Fearlessness', 'Power'],
      rating: 4.6
    },
    {
      id: 8,
      name: '12 Mukhi Rudraksha',
      price: 38,
      category: 'rare',
      desc: 'Suryamukhi - Sun energy',
      benefits: ['Leadership & success', 'Authority', 'Confidence'],
      rating: 4.9
    },
    {
      id: 9,
      name: '2 Mukhi Rudraksha',
      price: 18,
      category: 'popular',
      desc: 'Ardhanari - Balance',
      benefits: ['Relationship harmony', 'Balance', 'Peace'],
      rating: 4.7
    },
    {
      id: 10,
      name: '4 Mukhi Rudraksha',
      price: 19,
      category: 'popular',
      desc: 'Brahma Rudraksha - Knowledge',
      benefits: ['Creativity', 'Communication', 'Expression'],
      rating: 4.8
    },
    {
      id: 11,
      name: '9 Mukhi Rudraksha',
      price: 32,
      category: 'premium',
      desc: 'Chandramukhi - Moon energy',
      benefits: ['Emotional balance', 'Intuition', 'Peace'],
      rating: 4.8
    },
    {
      id: 12,
      name: '13 Mukhi Rudraksha',
      price: 42,
      category: 'rare',
      desc: 'Kamdev Rudraksha',
      benefits: ['Love & attraction', 'Relationships', 'Harmony'],
      rating: 4.9
    }
  ];

  const categories = [
    { id: 'all', label: 'All Products', icon: Leaf, count: products.length },
    { id: 'popular', label: 'Popular', icon: Star, count: products.filter(p => p.category === 'popular').length },
    { id: 'premium', label: 'Premium', icon: Zap, count: products.filter(p => p.category === 'premium').length },
    { id: 'rare', label: 'Rare & Exclusive', icon: Heart, count: products.filter(p => p.category === 'rare').length }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (productName) => {
    setCart(cart + 1);
    // You can add a toast notification here
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FFF9F0 0%, #FFE8C7 100%)' }}>
      {/* Navigation */}
      <nav className="fixed w-full shadow-lg z-50" style={{ backgroundColor: '#FFE8C7' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/landing" className="flex items-center gap-2 hover:opacity-80 transition group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" style={{ color: '#2C1810' }} />
              <span className="text-xl font-bold hidden sm:inline" style={{ color: '#2C1810' }}>
                Rudra Shaambhu
              </span>
            </Link>
            
            <div className="hidden md:flex gap-8 items-center">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`font-medium transition-all px-4 py-2 rounded-lg flex items-center gap-2`}
                  style={{
                    color: selectedCategory === cat.id ? '#FFFFFF' : '#2C1810',
                    backgroundColor: selectedCategory === cat.id ? '#8B4513' : 'transparent'
                  }}
                >
                  <cat.icon className="w-4 h-4" />
                  <span>{cat.label}</span>
                  <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                    {categories.find(c => c.id === selectedCategory)?.id === cat.id 
                      ? filteredProducts.length 
                      : cat.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div 
                className="relative p-3 rounded-full cursor-pointer transition-all hover:scale-110"
                style={{ backgroundColor: '#FFD8A8' }}
              >
                <ShoppingCart className="w-6 h-6" style={{ color: '#2C1810' }} />
                {cart > 0 && (
                  <span 
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center animate-bounce"
                    style={{ backgroundColor: '#8B4513' }}
                  >
                    {cart}
                  </span>
                )}
              </div>
              
              <button 
                className="md:hidden p-2"
                style={{ color: '#2C1810' }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t" style={{ backgroundColor: '#FFE8C7', borderColor: '#FFD8A8' }}>
            <div className="px-6 py-4 space-y-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left font-medium p-3 rounded-lg transition-all"
                  style={{ 
                    color: selectedCategory === cat.id ? '#FFFFFF' : '#2C1810',
                    backgroundColor: selectedCategory === cat.id ? '#8B4513' : '#FFD8A8'
                  }}
                >
                  {cat.label} ({cat.count})
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: '#2C1810' }}>
            Explore Sacred Rudraksha
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: '#4A3728' }}>
            Discover our authentic collection of Rudraksha beads, each with unique spiritual properties. 
            From the rarest single-faced beads to popular protection beads.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <div className="px-6 py-3 rounded-lg" style={{ backgroundColor: '#FFD8A8', color: '#2C1810' }}>
              <p className="text-sm">📦 <span className="font-semibold">{products.length}</span> Products</p>
            </div>
            <div className="px-6 py-3 rounded-lg" style={{ backgroundColor: '#FFD8A8', color: '#2C1810' }}>
              <p className="text-sm">⭐ <span className="font-semibold">4.8+</span> Avg Rating</p>
            </div>
            <div className="px-6 py-3 rounded-lg" style={{ backgroundColor: '#FFD8A8', color: '#2C1810' }}>
              <p className="text-sm">🌍 <span className="font-semibold">100%</span> Authentic</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Category Filter */}
          <div className="md:hidden mb-8">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-lg font-semibold"
              style={{ backgroundColor: '#8B4513', color: '#FFFFFF' }}
            >
              <Filter className="w-5 h-5" />
              Filter by Category
            </button>
            
            {showFilters && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setShowFilters(false);
                    }}
                    className="p-3 rounded-lg font-medium transition-all"
                    style={{
                      color: selectedCategory === cat.id ? '#FFFFFF' : '#2C1810',
                      backgroundColor: selectedCategory === cat.id ? '#8B4513' : '#FFE8C7'
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:scale-105 hover:-translate-y-2"
                style={{ backgroundColor: '#FFFFFF', border: '2px solid #FFD8A8' }}
              >
                {/* Product Header with Icon */}
                <div 
                  className="h-32 flex items-center justify-center text-6xl font-bold transition-transform hover:scale-125"
                  style={{ backgroundColor: 'linear-gradient(135deg, #FFE8C7 0%, #FFD8A8 100%)' }}
                >
                  {['🔱', '🌙', '✨', '💎', '🔥', '📚', '⚡', '☀️', '💫', '🌊', '🦅', '💝'][product.id - 1]}
                </div>

                <div className="p-6">
                  {/* Product Name */}
                  <h3 className="text-lg font-bold mb-2" style={{ color: '#2C1810' }}>
                    {product.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm mb-4 font-medium" style={{ color: '#8B4513' }}>
                    {product.desc}
                  </p>

                  {/* Benefits */}
                  <div className="mb-4 space-y-2">
                    {product.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs" style={{ color: '#4A3728' }}>
                        <span className="text-lg leading-none">✨</span>
                        <span className="leading-snug">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4 pb-4" style={{ borderBottom: '1px solid #FFE8C7' }}>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4"
                          style={{
                            fill: i < Math.floor(product.rating) ? '#FFD8A8' : '#FFE8C7',
                            color: '#8B4513'
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-semibold" style={{ color: '#8B4513' }}>
                      {product.rating}
                    </span>
                  </div>

                  {/* Price and Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold" style={{ color: '#8B4513' }}>
                      ${product.price}
                    </span>
                    <button
                      onClick={() => addToCart(product.name)}
                      className="px-4 py-2 rounded-lg font-semibold transition-all hover:scale-110 active:scale-95"
                      style={{ backgroundColor: '#FFD8A8', color: '#2C1810' }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-2xl font-semibold" style={{ color: '#4A3728' }}>
                No products found in this category
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6" style={{ backgroundColor: '#8B4513' }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Why Choose Our Rudraksha?
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center text-white">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-2xl font-bold mb-3">100% Authentic</h3>
              <p className="text-sm opacity-90">Genuine beads directly from trusted sources</p>
            </div>
            <div className="text-center text-white">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-3">Certified Quality</h3>
              <p className="text-sm opacity-90">Every bead tested for authenticity</p>
            </div>
            <div className="text-center text-white">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-2xl font-bold mb-3">Fast Delivery</h3>
              <p className="text-sm opacity-90">Secure packaging & worldwide shipping</p>
            </div>
            <div className="text-center text-white">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-2xl font-bold mb-3">Expert Support</h3>
              <p className="text-sm opacity-90">Dedicated guidance for your needs</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6" style={{ background: 'linear-gradient(135deg, #FFD8A8 0%, #FFE8C7 100%)' }}>
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold" style={{ color: '#2C1810' }}>
            Begin Your Spiritual Journey
          </h2>
          <p className="text-lg md:text-xl" style={{ color: '#4A3728' }}>
            {cart > 0 
              ? `✨ You have ${cart} sacred beads in your cart! Ready to checkout?` 
              : 'Choose your sacred Rudraksha bead and experience the spiritual transformation'}
          </p>
          <button
            className="px-10 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: '#8B4513', color: '#FFFFFF' }}
          >
            {cart > 0 ? `Checkout (${cart} items)` : 'Continue Shopping'}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6" style={{ backgroundColor: '#2C1810' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4">Rudra Shaambhu</h3>
              <p className="text-base" style={{ color: '#FFD8A8' }}>
                Bringing authentic spiritual wisdom and sacred Rudraksha beads to seekers worldwide. 
                Transform your meditation practice and spiritual journey with our premium collection.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4 text-lg">Quick Links</h4>
              <div className="space-y-3">
                <Link href="/landing" className="block transition text-base hover:text-white" style={{ color: '#FFD8A8' }}>Home</Link>
                <a href="#" className="block transition text-base hover:text-white" style={{ color: '#FFD8A8' }}>About Us</a>
                <a href="#" className="block transition text-base hover:text-white" style={{ color: '#FFD8A8' }}>How to Use</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4 text-lg">Customer Care</h4>
              <div className="space-y-3">
                <a href="#" className="block transition text-base hover:text-white" style={{ color: '#FFD8A8' }}>Contact Us</a>
                <a href="#" className="block transition text-base hover:text-white" style={{ color: '#FFD8A8' }}>FAQ</a>
                <a href="#" className="block transition text-base hover:text-white" style={{ color: '#FFD8A8' }}>Shipping Info</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-opacity-30 pt-8 text-center" style={{ borderColor: '#FFD8A8' }}>
            <p style={{ color: '#FFD8A8' }}>&copy; 2026 Rudra Shaambhu. All rights reserved. | Spreading spiritual wisdom worldwide 🙏</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
