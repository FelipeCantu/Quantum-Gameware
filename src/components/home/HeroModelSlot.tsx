'use client';
// Client-only, code-split mount for the 3D headphones, so three.js never blocks the hero text (LCP).
import dynamic from 'next/dynamic';

export default dynamic(() => import('./HeroModel'), { ssr: false });
