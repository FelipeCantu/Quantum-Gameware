"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

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
        @keyframes wave {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes wave-reverse {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-wave {
          animation: wave 8s ease-in-out infinite;
        }
        .animate-wave-reverse {
          animation: wave-reverse 10s ease-in-out infinite;
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
      `}</style>
      
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated moving gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 animate-gradient-xy">
          
          {/* Water wave effects */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Primary wave layer */}
            <div className="absolute bottom-0 left-0 w-full h-32 opacity-30">
              <svg className="absolute bottom-0 w-full h-full animate-wave" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
                      fill="url(#wave-gradient-1)" fillOpacity="1">
                </path>
              </svg>
            </div>
            
            {/* Secondary wave layer */}
            <div className="absolute bottom-0 left-0 w-full h-24 opacity-20">
              <svg className="absolute bottom-0 w-full h-full animate-wave-reverse" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
                      fill="url(#wave-gradient-2)" fillOpacity="1">
                </path>
              </svg>
            </div>
            
            {/* Tertiary wave layer */}
            <div className="absolute bottom-0 left-0 w-full h-16 opacity-15">
              <svg className="absolute bottom-0 w-full h-full animate-wave" style={{animationDelay: '-2s', animationDuration: '12s'}} viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M0,0V7.23C0,65.52,268.63,112.77,600,112.77S1200,65.52,1200,7.23V0Z" 
                      fill="url(#wave-gradient-3)" fillOpacity="1">
                </path>
              </svg>
            </div>
          </div>

          {/* Gradient definitions for waves */}
          <svg width="0" height="0">
            <defs>
              <linearGradient id="wave-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8"/>
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8"/>
              </linearGradient>
              <linearGradient id="wave-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6"/>
                <stop offset="50%" stopColor="#a855f7" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.6"/>
              </linearGradient>
              <linearGradient id="wave-gradient-3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4"/>
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.4"/>
              </linearGradient>
            </defs>
          </svg>

        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        {/* Floating orbs with enhanced animation - now with float effect */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000 animate-float" style={{animationDelay: '2s'}}></div>
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
        }}
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
              }}
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
          }}
        >
          {/* Large Axolotl Mascot - centered above everything - much bigger */}
          <div className="relative mb-12">
            {/* Glow effect behind mascot - bigger */}
            <div className="absolute inset-0 w-80 h-80 mx-auto bg-gradient-to-br from-blue-400 to-purple-600 rounded-full blur-3xl opacity-40 animate-pulse"></div>
            
            {/* Axolotl mascot - much larger and more prominent */}
            <img 
              src="/qg-axolotl-rbg.png" 
              alt="QG Axolotl Mascot" 
              className="relative w-80 h-80 mx-auto object-contain drop-shadow-2xl animate-pulse"
            />
          </div>

          {/* Header-style logo and brand name (exact footer styling but bigger) */}
          <div className="flex items-center justify-center space-x-6">
            {/* Logo with footer styling - much bigger */}
            <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-3 shadow-2xl">
              <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                <img
                  src="/nextgens-logo.png"
                  alt="Quantum Gameware Logo"
                  className="w-16 h-16 object-contain p-2"
                />
              </div>
            </div>
            
            {/* Brand name with exact footer gradient styling - much bigger */}
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

          {/* Tagline */}
          <p className="text-white/80 text-lg font-light tracking-wide">
            Next-Gen Gaming Technology
          </p>
        </div>

        {/* Curtain effect bars that slide down */}
        <div 
          className={`absolute inset-x-0 top-0 h-full bg-gradient-to-b from-slate-900 to-transparent transition-all duration-1000 ${
            animationStarted ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          }`}
          style={{ 
            transitionDelay: animationStarted ? '800ms' : '0ms',
            height: '120%'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32">
        <div className="text-center">
          {/* Badge - slides in from top */}
          <div 
            className={`inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-8 transition-all duration-800 ${
              animationStarted ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'
            }`}
            style={{ transitionDelay: '2200ms' }}
          >
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            New Gaming Gear Available
          </div>

          {/* Main heading - fades in and scales up */}
          <h1 
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight transition-all duration-1000 ${
              animationStarted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
            style={{ transitionDelay: '2400ms' }}
          >
            Level Up Your
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Gaming Experience
            </span>
          </h1>

          {/* Subtitle - slides in from bottom */}
          <p 
            className={`text-lg sm:text-xl lg:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-800 ${
              animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: '2600ms' }}
          >
            Premium gaming accessories designed for competitive gamers who demand excellence.
            From pro-grade peripherals to cutting-edge gear.
          </p>

          {/* CTA Buttons - slide in from left and right */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16">
            <Link 
              href="/products" 
              className={`group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl overflow-hidden transition-all duration-800 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 w-full sm:w-auto ${
                animationStarted ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
              }`}
              style={{ transitionDelay: '2800ms' }}
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
              style={{ transitionDelay: '2800ms' }}
            >
              <span className="flex items-center">
                Browse Categories
                <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </span>
            </Link>
          </div>

          {/* Features/Stats - stagger animation from different directions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div 
              className={`group transition-all duration-800 ${
                animationStarted ? 'translate-x-0 opacity-100' : '-translate-x-16 opacity-0'
              }`}
              style={{ transitionDelay: '3000ms' }}
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
              style={{ transitionDelay: '3100ms' }}
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
              style={{ transitionDelay: '3200ms' }}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-white/70">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator - fades in last */}
      <div 
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce transition-opacity duration-800 ${
          animationStarted ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: '3400ms' }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
      </section>
    </>
  );
}