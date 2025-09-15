"use client";

import Link from 'next/link';
import { useState, useEffect, CSSProperties } from 'react';

// Extend CSSProperties to include CSS custom properties
interface CustomCSSProperties extends CSSProperties {
  '--duration'?: string;
  '--delay'?: string;
  '--random-drift'?: string;
  '--sway-distance'?: string;
  '--sway-duration'?: string;
  '--sway-rotation'?: string;
  '--current-duration'?: string;
  '--random-x'?: string;
  '--random-y'?: string;
}

export default function Hero() {
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    // Start the animation sequence after component mounts
    const timer = setTimeout(() => {
      setAnimationStarted(true);
    }, 500); // Small delay before starting

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes gradient-xy {
          0%, 100% {
            background: linear-gradient(45deg, #1e3a8a, #581c87, #312e81, #1e40af);
            background-size: 400% 400%;
            background-position: 0% 50%;
          }
          25% {
            background: linear-gradient(135deg, #581c87, #312e81, #1e40af, #7c3aed);
            background-size: 400% 400%;
            background-position: 100% 0%;
          }
          50% {
            background: linear-gradient(225deg, #312e81, #1e40af, #7c3aed, #1e3a8a);
            background-size: 400% 400%;
            background-position: 100% 100%;
          }
          75% {
            background: linear-gradient(315deg, #1e40af, #7c3aed, #1e3a8a, #581c87);
            background-size: 400% 400%;
            background-position: 0% 100%;
          }
        }
        .animate-gradient-xy {
          animation: gradient-xy 8s ease infinite;
        }
        @keyframes bubble-float {
          0% {
            transform: translateY(100vh) translateX(0px) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: translateY(90vh) translateX(0px) scale(1);
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-10vh) translateX(var(--random-drift, 50px)) scale(0);
            opacity: 0;
          }
        }
        .animate-bubble {
          animation: bubble-float var(--duration, 8s) ease-in-out infinite;
          animation-delay: var(--delay, 0s);
        }
        @keyframes gentle-sway {
          0%, 100% {
            transform: translateX(0px) rotate(0deg);
          }
          50% {
            transform: translateX(var(--sway-distance, 10px)) rotate(var(--sway-rotation, 2deg));
          }
        }
        .animate-sway {
          animation: gentle-sway var(--sway-duration, 6s) ease-in-out infinite;
        }
        @keyframes underwater-current {
          0% {
            transform: translateX(-50px) translateY(0px);
          }
          25% {
            transform: translateX(30px) translateY(-20px);
          }
          50% {
            transform: translateX(50px) translateY(-10px);
          }
          75% {
            transform: translateX(-30px) translateY(-30px);
          }
          100% {
            transform: translateX(-50px) translateY(0px);
          }
        }
        .animate-current {
          animation: underwater-current var(--current-duration, 15s) ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(1deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes scatter {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.8;
          }
          100% {
            transform: translate(var(--random-x, 200px), var(--random-y, 300px)) scale(0);
            opacity: 0;
          }
        }
        .animate-scatter {
          animation: scatter 1s ease-out forwards;
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
      `}</style>
      
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated moving gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 animate-gradient-xy">
          
          {/* Underwater effect - floating bubbles */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Small bubbles */}
            {[...Array(15)].map((_, i) => (
              <div
                key={`bubble-${i}`}
                className="absolute w-2 h-2 bg-white/20 rounded-full animate-bubble"
                style={{
                  left: `${Math.random() * 100}%`,
                  '--duration': `${6 + Math.random() * 4}s`,
                  '--delay': `${Math.random() * 5}s`,
                  '--random-drift': `${(Math.random() - 0.5) * 100}px`,
                } as CustomCSSProperties}
              />
            ))}
            
            {/* Medium bubbles */}
            {[...Array(8)].map((_, i) => (
              <div
                key={`bubble-med-${i}`}
                className="absolute w-3 h-3 bg-blue-200/15 rounded-full animate-bubble"
                style={{
                  left: `${Math.random() * 100}%`,
                  '--duration': `${8 + Math.random() * 4}s`,
                  '--delay': `${Math.random() * 6}s`,
                  '--random-drift': `${(Math.random() - 0.5) * 120}px`,
                } as CustomCSSProperties}
              />
            ))}
            
            {/* Large bubbles */}
            {[...Array(4)].map((_, i) => (
              <div
                key={`bubble-large-${i}`}
                className="absolute w-4 h-4 bg-cyan-200/10 rounded-full animate-bubble"
                style={{
                  left: `${Math.random() * 100}%`,
                  '--duration': `${10 + Math.random() * 5}s`,
                  '--delay': `${Math.random() * 8}s`,
                  '--random-drift': `${(Math.random() - 0.5) * 150}px`,
                } as CustomCSSProperties}
              />
            ))}
            
            {/* Underwater plants/kelp effect */}
            <div 
              className="absolute bottom-0 left-1/4 w-1 h-32 bg-gradient-to-t from-green-600/30 to-transparent animate-sway"
              style={{
                '--sway-distance': '15px', 
                '--sway-duration': '4s', 
                '--sway-rotation': '3deg'
              } as CustomCSSProperties} 
            />
            <div 
              className="absolute bottom-0 left-1/3 w-1 h-40 bg-gradient-to-t from-emerald-600/25 to-transparent animate-sway"
              style={{
                '--sway-distance': '20px', 
                '--sway-duration': '5s', 
                '--sway-rotation': '-2deg'
              } as CustomCSSProperties} 
            />
            <div 
              className="absolute bottom-0 right-1/4 w-1 h-36 bg-gradient-to-t from-teal-600/30 to-transparent animate-sway"
              style={{
                '--sway-distance': '12px', 
                '--sway-duration': '4.5s', 
                '--sway-rotation': '4deg'
              } as CustomCSSProperties} 
            />
            <div 
              className="absolute bottom-0 right-1/3 w-1 h-28 bg-gradient-to-t from-green-700/25 to-transparent animate-sway"
              style={{
                '--sway-distance': '18px', 
                '--sway-duration': '6s', 
                '--sway-rotation': '-3deg'
              } as CustomCSSProperties} 
            />
            
            {/* Underwater current particles */}
            {[...Array(6)].map((_, i) => (
              <div
                key={`current-${i}`}
                className="absolute w-8 h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-current"
                style={{
                  top: `${20 + i * 12}%`,
                  left: `${10 + (i * 15)}%`,
                  '--current-duration': `${12 + Math.random() * 8}s`,
                  animationDelay: `${i * 2}s`,
                } as CustomCSSProperties}
              />
            ))}
            
            {/* Gentle light rays from above */}
            <div className="absolute top-0 left-1/4 w-32 h-full bg-gradient-to-b from-blue-200/5 to-transparent animate-shimmer opacity-30" />
            <div 
              className="absolute top-0 right-1/3 w-24 h-full bg-gradient-to-b from-cyan-200/5 to-transparent animate-shimmer opacity-25"
              style={{ animationDelay: '1s' } as CSSProperties}
            />
          </div>

          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            } as CSSProperties}></div>
          </div>
        
          {/* Floating orbs with enhanced animation */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animate-float"></div>
          <div 
            className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000 animate-float" 
            style={{ animationDelay: '1s' } as CSSProperties}
          ></div>
          <div 
            className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000 animate-float" 
            style={{ animationDelay: '2s' } as CSSProperties}
          ></div>
        </div>

        {/* Opening Logo Animation Overlay */}
        <div 
          className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-1200 ${
            animationStarted 
              ? 'translate-y-full scale-110 opacity-0' 
              : 'translate-y-0 scale-100 opacity-100'
          }`}
          style={{ 
            transitionDelay: animationStarted ? '0ms' : '2000ms',
            transitionTimingFunction: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            background: animationStarted 
              ? 'linear-gradient(45deg, #1e3a8a, #581c87, #312e81)' 
              : 'linear-gradient(135deg, #0f172a, #1e293b, #334155)'
          } as CSSProperties}
        >
          {/* Animated particles that scatter on exit */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 bg-white rounded-full transition-all duration-1000 ${
                  animationStarted ? 'animate-scatter' : 'opacity-0'
                }`}
                style={{
                  left: `${20 + (i * 5)}%`,
                  top: `${30 + (i * 3)}%`,
                  transitionDelay: `${200 + i * 50}ms`,
                  animationDelay: `${i * 100}ms`
                } as CSSProperties}
              />
            ))}
          </div>

          <div 
            className={`text-center relative z-10 transition-all duration-800 ${
              animationStarted 
                ? 'scale-75 -translate-y-8 opacity-0' 
                : 'scale-100 translate-y-0 opacity-100'
            }`}
            style={{ 
              transitionDelay: animationStarted ? '200ms' : '500ms',
              transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            } as CSSProperties}
          >
            {/* Large Axolotl Mascot */}
            <div className="relative mb-12">
              {/* Glow effect behind mascot */}
              <div className="absolute inset-0 w-80 h-80 mx-auto bg-gradient-to-br from-blue-400 to-purple-600 rounded-full blur-3xl opacity-40 animate-pulse"></div>
              
              <img 
                src="/qg-axolotl-rbg.png" 
                alt="QG Axolotl Mascot" 
                className="relative w-80 h-80 mx-auto object-contain drop-shadow-2xl animate-pulse"
              />
            </div>

            {/* Header-style logo and brand name */}
            <div className="flex items-center justify-center space-x-6">
              <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-3 shadow-2xl">
                <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                  <img
                    src="/nextgens-logo.png"
                    alt="Quantum Gameware Logo"
                    className="w-16 h-16 object-contain p-2"
                  />
                </div>
              </div>
              
              <div>
                <span className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Quantum
                </span>
                <div className="text-2xl text-white/80 -mt-2">Gameware</div>
              </div>
            </div>

            {/* Animated underline */}
            <div className="relative w-32 h-1 mx-auto mt-4 mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent rounded-full opacity-50 animate-ping"></div>
            </div>

            <p className="text-white/80 text-lg font-light tracking-wide">
              Next-Gen Gaming Technology
            </p>
          </div>

          {/* Curtain effect */}
          <div 
            className={`absolute inset-x-0 top-0 h-full bg-gradient-to-b from-slate-900 to-transparent transition-all duration-1000 ${
              animationStarted ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            }`}
            style={{ 
              transitionDelay: animationStarted ? '800ms' : '0ms',
              height: '120%'
            } as CSSProperties}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32">
          <div className="text-center">
            {/* Badge */}
            <div 
              className={`inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-8 transition-all duration-800 ${
                animationStarted ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'
              }`}
              style={{ transitionDelay: '2200ms' } as CSSProperties}
            >
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              New Gaming Gear Available
            </div>

            {/* Main heading */}
            <h1 
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight transition-all duration-1000 ${
                animationStarted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
              }`}
              style={{ transitionDelay: '2400ms' } as CSSProperties}
            >
              Level Up Your
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Gaming Experience
              </span>
            </h1>

            {/* Subtitle */}
            <p 
              className={`text-lg sm:text-xl lg:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-800 ${
                animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: '2600ms' } as CSSProperties}
            >
              Premium gaming accessories designed for competitive gamers who demand excellence.
              From pro-grade peripherals to cutting-edge gear.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16">
              <Link 
                href="/products" 
                className={`group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl overflow-hidden transition-all duration-800 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 w-full sm:w-auto ${
                  animationStarted ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
                }`}
                style={{ transitionDelay: '2800ms' } as CSSProperties}
              >
                <span className="relative z-10 flex items-center">
                  Shop Now
                  <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <Link 
                href="/categories" 
                className={`group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-2xl backdrop-blur-sm hover:border-white hover:bg-white/10 transition-all duration-800 hover:scale-105 w-full sm:w-auto ${
                  animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
                }`}
                style={{ transitionDelay: '2800ms' } as CSSProperties}
              >
                <span className="flex items-center">
                  Browse Categories
                  <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Features/Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div 
                className={`group transition-all duration-800 ${
                  animationStarted ? 'translate-x-0 opacity-100' : '-translate-x-16 opacity-0'
                }`}
                style={{ transitionDelay: '3000ms' } as CSSProperties}
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="text-3xl font-bold text-white mb-2">10K+</div>
                  <div className="text-white/70">Happy Gamers</div>
                </div>
              </div>
              <div 
                className={`group transition-all duration-800 ${
                  animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
                }`}
                style={{ transitionDelay: '3100ms' } as CSSProperties}
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="text-3xl font-bold text-white mb-2">99.9%</div>
                  <div className="text-white/70">Uptime</div>
                </div>
              </div>
              <div 
                className={`group transition-all duration-800 ${
                  animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-16 opacity-0'
                }`}
                style={{ transitionDelay: '3200ms' } as CSSProperties}
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="text-3xl font-bold text-white mb-2">24/7</div>
                  <div className="text-white/70">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div 
          className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce transition-opacity duration-800 ${
            animationStarted ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '3400ms' } as CSSProperties}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>
    </>
  );
}