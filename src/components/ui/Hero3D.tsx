"use client";

import Link from 'next/link';
import React, { useState, useEffect, CSSProperties, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  Float,
  Environment,
  ContactShadows,
} from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

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

// 3D Model Component with slide-up animation
function HeadphonesModel({ isVisible }: { isVisible: boolean }) {
  const { scene } = useGLTF('/174-headphones.gltf');
  const modelRef = useRef<THREE.Group>(null);
  const [hasSlideAnimated, setHasSlideAnimated] = useState(false);
  
  // Enhance materials and remove background
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Remove background/wall elements
        const backgroundNames = ['background', 'wall', 'floor', 'plane', 'backdrop', 'ground', 'base'];
        const childName = child.name.toLowerCase();
        
        const isBackground = backgroundNames.some(name => childName.includes(name));
        
        if (child.geometry) {
          const box = new THREE.Box3().setFromObject(child);
          const size = new THREE.Vector3();
          box.getSize(size);
          
          const isLargeFlatPlane = (
            (size.x > 10 || size.y > 10 || size.z > 10) && 
            (size.x < 0.5 || size.y < 0.5 || size.z < 0.5)
          );
          
          if (isBackground || isLargeFlatPlane) {
            child.visible = false;
            return;
          }
        }
        
        child.castShadow = true;
        child.receiveShadow = true;
        
        if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material.envMapIntensity = 0.5;
          child.material.roughness = 0.4;
          child.material.metalness = 0.7;
          child.material.color = new THREE.Color(0xb8b8ff);
        }
      }
    });
  }, [scene]);

  // Slide-up animation and floating
  useFrame((state) => {
    if (modelRef.current) {
      if (isVisible && !hasSlideAnimated) {
        // Smooth slide up animation from top
        const slideProgress = Math.min((state.clock.elapsedTime - 2) / 2, 1);
        if (slideProgress > 0) {
          const easeOutCubic = 1 - Math.pow(1 - slideProgress, 3);
          modelRef.current.position.y = THREE.MathUtils.lerp(5, 1, easeOutCubic) + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
          modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15 + state.clock.elapsedTime * 0.1;
          
          if (slideProgress >= 1) {
            setHasSlideAnimated(true);
          }
        } else {
          modelRef.current.position.y = 5;
        }
      } else if (hasSlideAnimated) {
        modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15 + state.clock.elapsedTime * 0.1;
        modelRef.current.position.y = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      }
    }
  });

  return (
    <group ref={modelRef}>
      <Float 
        speed={2} 
        rotationIntensity={0.1} 
        floatIntensity={0.2}
        floatingRange={[-0.05, 0.05]}
        enabled={hasSlideAnimated}
      >
        <primitive 
          object={scene} 
          scale={1.8} 
          position={[0, 0, 0]}
        />
      </Float>
    </group>
  );
}

// Preload the model
if (typeof window !== 'undefined') {
  useGLTF.preload('/174-headphones.gltf');
}

export default function Hero() {
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationStarted(true);
    }, 500);

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
        @keyframes scroll-bounce {
          0%, 100% {
            transform: translateY(0px);
            opacity: 0.7;
          }
          50% {
            transform: translateY(10px);
            opacity: 1;
          }
        }
        .animate-scroll-bounce {
          animation: scroll-bounce 2s ease-in-out infinite;
        }
        @keyframes counter-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-counter-up {
          animation: counter-up 0.8s ease-out forwards;
        }
      `}</style>
      
      <section className="relative overflow-hidden">
        {/* Animated moving gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 animate-gradient-xy">
          
          {/* Underwater effect - floating bubbles */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Small bubbles */}
            {[...Array(10)].map((_, i) => (
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
              className="absolute bottom-0 right-1/4 w-1 h-36 bg-gradient-to-t from-teal-600/30 to-transparent animate-sway"
              style={{
                '--sway-distance': '12px', 
                '--sway-duration': '4.5s', 
                '--sway-rotation': '4deg'
              } as CustomCSSProperties} 
            />
          </div>
        
          {/* Floating orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animate-float"></div>
          <div 
            className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animate-float" 
            style={{ animationDelay: '2s' } as CSSProperties}
          ></div>
        </div>

        {/* 3D Model Canvas */}
        <div className="absolute inset-0 z-[5] pointer-events-none">
          <Canvas 
            className="w-full h-full"
            camera={{ position: [0, 0, 5], fov: 45 }}
            gl={{ 
              antialias: true,
              alpha: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.2
            }}
          >
            <ambientLight intensity={0.3} />
            <directionalLight
              position={[5, 5, 5]}
              intensity={0.6}
              color="#b8b8ff"
            />
            <directionalLight 
              position={[-5, 3, -5]} 
              intensity={0.3} 
              color="#8b5cf6" 
            />
            
            <Environment preset="city" environmentIntensity={0.3} />
            
            <Suspense fallback={null}>
              <HeadphonesModel isVisible={animationStarted} />
            </Suspense>
            
            <ContactShadows
              position={[0, -2, 0]}
              opacity={0.2}
              scale={10}
              blur={2}
              far={4}
              color="#000033"
            />
            
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              enableRotate={false}
              autoRotate
              autoRotateSpeed={0.3}
            />
          </Canvas>
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
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 bg-white rounded-full transition-all duration-1000 ${
                  animationStarted ? 'animate-scatter' : 'opacity-0'
                }`}
                style={{
                  left: `${20 + (i * 7)}%`,
                  top: `${30 + (i * 5)}%`,
                  '--random-x': `${(Math.random() - 0.5) * 400}px`,
                  '--random-y': `${(Math.random() - 0.5) * 400}px`,
                  transitionDelay: `${200 + i * 50}ms`,
                  animationDelay: `${i * 100}ms`
                } as CustomCSSProperties}
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
            <div className="relative mb-8">
              <div className="absolute inset-0 w-64 h-64 mx-auto bg-gradient-to-br from-blue-400 to-purple-600 rounded-full blur-3xl opacity-40 animate-pulse"></div>
              <img 
                src="/qg-axolotl-rbg.png" 
                alt="QG Axolotl Mascot" 
                className="relative w-64 h-64 mx-auto object-contain drop-shadow-2xl"
              />
            </div>

            {/* Header-style logo and brand name */}
            <div className="flex items-center justify-center space-x-4">
              <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-2 shadow-2xl">
                <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                  <img
                    src="/nextgens-logo.png"
                    alt="Quantum Gameware Logo"
                    className="w-14 h-14 object-contain p-2"
                  />
                </div>
              </div>
              
              <div>
                <span className="font-brand text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Quantum
                </span>
                <div className="font-brand text-lg text-white/80">Gameware</div>
              </div>
            </div>

            <div className="relative w-24 h-1 mx-auto mt-4 mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full"></div>

            <p className="text-white/80 text-base font-light tracking-wide">
              Quality Gaming Gear at Great Prices
            </p>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="relative z-10 w-full min-h-screen pointer-events-auto">
          {/* Mobile & Tablet: Vertical Layout */}
          <div className="lg:hidden flex flex-col items-center justify-center px-6 text-center space-y-6 py-20 min-h-screen">
            {/* Badge */}
            <div 
              className={`inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium transition-all duration-800 ${
                animationStarted ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'
              }`}
              style={{ transitionDelay: '2200ms' } as CustomCSSProperties}
            >
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Free Shipping Over $50
            </div>

            {/* Main heading */}
            <h1 
              className={`font-brand text-3xl font-bold text-white leading-tight transition-all duration-1000 ${
                animationStarted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
              }`}
              style={{ transitionDelay: '2400ms' } as CustomCSSProperties}
            >
              Quality Gaming Gear
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Without the Premium Price
              </span>
            </h1>

            {/* Description */}
            <p 
              className={`text-lg text-white/80 leading-relaxed transition-all duration-800 ${
                animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: '2600ms' } as CustomCSSProperties}
            >
              Affordable accessories for gamers and streamers who want great performance without breaking the bank.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col space-y-3 w-full max-w-sm">
              <Link 
                href="/products" 
                className={`group relative inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl overflow-hidden transition-all duration-800 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 ${
                  animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
                }`}
                style={{ transitionDelay: '2800ms' } as CustomCSSProperties}
              >
                <span className="relative z-10 flex items-center">
                  Shop Affordable Gear
                  <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>

              <Link 
                href="/categories" 
                className={`group inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white border-2 border-white/30 rounded-xl backdrop-blur-sm hover:border-white hover:bg-white/10 transition-all duration-800 ${
                  animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
                }`}
                style={{ transitionDelay: '2900ms' } as CustomCSSProperties}
              >
                Browse Categories
              </Link>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block w-full h-full min-h-screen">
            {/* Left Side - Main Content */}
            <div className="absolute left-12 top-1/2 transform -translate-y-1/2 max-w-lg z-20">
              <h1 
                className={`font-brand text-4xl font-bold text-white mb-6 leading-tight transition-all duration-1000 ${
                  animationStarted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                }`}
                style={{ transitionDelay: '2400ms' } as CustomCSSProperties}
              >
                Quality Gaming Gear
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Without the Premium Price
                </span>
              </h1>

              <p 
                className={`text-xl text-white/80 mb-8 leading-relaxed transition-all duration-800 ${
                  animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: '2600ms' } as CustomCSSProperties}
              >
                Affordable accessories for gamers and streamers who want great performance without breaking the bank.
              </p>

              <div className="flex space-x-4">
                <Link 
                  href="/products" 
                  className={`group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl overflow-hidden transition-all duration-800 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 ${
                    animationStarted ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
                  }`}
                  style={{ transitionDelay: '2800ms' } as CustomCSSProperties}
                >
                  <span className="relative z-10 flex items-center">
                    Shop Now
                    <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>

                <Link 
                  href="/categories" 
                  className={`group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-xl backdrop-blur-sm hover:border-white hover:bg-white/10 transition-all duration-800 ${
                    animationStarted ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
                  }`}
                  style={{ transitionDelay: '2900ms' } as CustomCSSProperties}
                >
                  Browse
                </Link>
              </div>
            </div>

            {/* Right Side - Feature Cards */}
            <div className="absolute right-12 top-1/2 transform -translate-y-1/2 max-w-xs z-20 space-y-4">
              <div 
                className={`bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 transition-all duration-800 hover:bg-white/15 ${
                  animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
                }`}
                style={{ transitionDelay: '3000ms' } as CustomCSSProperties}
              >
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-white">Budget-Friendly</h3>
                </div>
                <p className="text-white/70 text-sm">Quality gear at prices that won't empty your wallet.</p>
              </div>

              <div 
                className={`bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 transition-all duration-800 hover:bg-white/15 ${
                  animationStarted ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
                }`}
                style={{ transitionDelay: '3100ms' } as CustomCSSProperties}
              >
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-white">Streamer Ready</h3>
                </div>
                <p className="text-white/70 text-sm">Perfect for content creators building their setup.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div 
          className={`relative z-20 bg-white/5 backdrop-blur-md border-t border-white/10 transition-all duration-1000 ${
            animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
          style={{ transitionDelay: '3300ms' } as CustomCSSProperties}
        >
          <div className="max-w-6xl mx-auto px-4 py-8 lg:px-6 lg:py-16">
            {/* Mobile: Stacked Layout */}
            <div className="block lg:hidden space-y-4">
              {/* 15K+ Happy Customers */}
              <div 
                className={`group transition-all duration-800 hover:scale-105 ${
                  animationStarted ? 'animate-counter-up' : 'opacity-0'
                }`}
                style={{ animationDelay: '3400ms' } as CSSProperties}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 group-hover:border-white/30 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-white mb-1">15K+</div>
                        <div className="text-sm text-white/80 font-medium">Happy Customers</div>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4.8★ Average Rating */}
              <div 
                className={`group transition-all duration-800 hover:scale-105 ${
                  animationStarted ? 'animate-counter-up' : 'opacity-0'
                }`}
                style={{ animationDelay: '3500ms' } as CSSProperties}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 group-hover:border-white/30 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-white mb-1">4.8★</div>
                        <div className="text-sm text-white/80 font-medium">Average Rating</div>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Free Shipping $50+ */}
              <div 
                className={`group transition-all duration-800 hover:scale-105 ${
                  animationStarted ? 'animate-counter-up' : 'opacity-0'
                }`}
                style={{ animationDelay: '3600ms' } as CSSProperties}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 group-hover:border-white/30 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-white mb-1">$50+</div>
                        <div className="text-sm text-white/80 font-medium">Free Shipping</div>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop: Grid Layout */}
            <div className="hidden lg:grid grid-cols-3 gap-12 text-center">
              {/* 15K+ Happy Customers */}
              <div 
                className={`group transition-all duration-800 hover:scale-105 ${
                  animationStarted ? 'animate-counter-up' : 'opacity-0'
                }`}
                style={{ animationDelay: '3400ms' } as CSSProperties}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 group-hover:border-white/20 transition-all duration-300">
                    <div className="text-4xl font-bold text-white mb-2">15K+</div>
                    <div className="text-sm text-white/80 font-medium">Happy Customers</div>
                  </div>
                </div>
              </div>

              {/* 4.8★ Average Rating */}
              <div 
                className={`group transition-all duration-800 hover:scale-105 ${
                  animationStarted ? 'animate-counter-up' : 'opacity-0'
                }`}
                style={{ animationDelay: '3500ms' } as CSSProperties}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 group-hover:border-white/20 transition-all duration-300">
                    <div className="text-4xl font-bold text-white mb-2">4.8★</div>
                    <div className="text-sm text-white/80 font-medium">Average Rating</div>
                  </div>
                </div>
              </div>

              {/* Free Shipping $50+ */}
              <div 
                className={`group transition-all duration-800 hover:scale-105 ${
                  animationStarted ? 'animate-counter-up' : 'opacity-0'
                }`}
                style={{ animationDelay: '3600ms' } as CSSProperties}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 group-hover:border-white/20 transition-all duration-300">
                    <div className="text-4xl font-bold text-white mb-2">$50+</div>
                    <div className="text-sm text-white/80 font-medium">Free Shipping</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator - moved inside statistics section */}
          <div 
            className={`flex flex-col items-center pb-8 transition-all duration-1000 ${
              animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: '3700ms' } as CustomCSSProperties}
          >
            <span className="text-white/70 text-xs font-medium mb-2">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-1">
              <div className="w-1 h-3 bg-white/70 rounded-full animate-scroll-bounce"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}