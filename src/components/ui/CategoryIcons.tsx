// src/components/ui/CategoryIcons.tsx
import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const CategoryIcons = {
  keyboards: ({ className = "w-6 h-6", size = 24 }: IconProps = {}) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="8" width="20" height="10" rx="2" />
      <path d="M6 12h.01M10 12h.01M14 12h.01M18 12h.01M6 15h.01M10 15h.01M14 15h.01M18 15h.01" />
      <path d="M7 8V6a2 2 0 012-2h6a2 2 0 012 2v2" />
    </svg>
  ),

  mice: ({ className = "w-6 h-6", size = 24 }: IconProps = {}) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C7.58 2 4 5.58 4 10v4c0 4.42 3.58 8 8 8s8-3.58 8-8v-4c0-4.42-3.58-8-8-8z" />
      <path d="M12 2v8" />
      <path d="M12 6a1 1 0 100-2 1 1 0 000 2z" />
    </svg>
  ),

  headsets: ({ className = "w-6 h-6", size = 24 }: IconProps = {}) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12v7a2 2 0 002 2h2a2 2 0 002-2v-4a2 2 0 00-2-2H3zm0 0a9 9 0 0118 0m0 0v7a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4a2 2 0 012-2h4z" />
      <path d="M21 19v1a2 2 0 01-2 2h-6" />
    </svg>
  ),

  monitors: ({ className = "w-6 h-6", size = 24 }: IconProps = {}) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
      <path d="M6 13h12M6 10h12" strokeWidth="0.5" opacity="0.3" />
    </svg>
  ),

  controllers: ({ className = "w-6 h-6", size = 24 }: IconProps = {}) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 12h4m2 0h2m4 0h0M10 10v4" />
      <path d="M17.5 9.5L21 6M6.5 9.5L3 6" />
      <path d="M4.5 10.5c0-1.5.5-2.5 1.5-2.5h12c1 0 1.5 1 1.5 2.5v4c0 3-1 5-2.5 6.5-1 1-2 1-2.5 1h-5c-.5 0-1.5 0-2.5-1-1.5-1.5-2.5-3.5-2.5-6.5v-4z" />
    </svg>
  ),

  chairs: ({ className = "w-6 h-6", size = 24 }: IconProps = {}) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 10V4a1 1 0 00-1-1H6a1 1 0 00-1 1v6M5 10v6M19 10v6M5 16l1 5M18 16l1 5M12 10v11" />
      <rect x="5" y="10" width="14" height="6" rx="2" />
    </svg>
  ),

  audio: ({ className = "w-6 h-6", size = 24 }: IconProps = {}) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <circle cx="12" cy="14" r="4" />
      <circle cx="12" cy="14" r="1.5" fill="currentColor" />
      <circle cx="8" cy="8" r="1" />
      <circle cx="16" cy="8" r="1" />
    </svg>
  ),

  microphones: ({ className = "w-6 h-6", size = 24 }: IconProps = {}) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 013 3v7a3 3 0 01-6 0V5a3 3 0 013-3z" />
      <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v3M8 22h8" />
      <circle cx="12" cy="7" r="0.5" fill="currentColor" />
      <circle cx="12" cy="10" r="0.5" fill="currentColor" />
    </svg>
  ),

  lighting: ({ className = "w-6 h-6", size = 24 }: IconProps = {}) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.3" />
    </svg>
  ),

  desks: ({ className = "w-6 h-6", size = 24 }: IconProps = {}) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9h18M3 9v11M3 9l1-6h16l1 6M21 9v11M5 20V9M19 20V9M7 13h4M13 13h4" />
      <path d="M5 20h14" />
    </svg>
  ),

  mousepads: ({ className = "w-6 h-6", size = 24 }: IconProps = {}) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M2 10h20" strokeWidth="0.5" opacity="0.3" />
      <path d="M2 14h20" strokeWidth="0.5" opacity="0.3" />
      <circle cx="17" cy="12" r="2" fill="currentColor" opacity="0.2" />
    </svg>
  ),

  webcams: ({ className = "w-6 h-6", size = 24 }: IconProps = {}) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="10" r="8" />
      <circle cx="12" cy="10" r="3" />
      <circle cx="12" cy="10" r="1" fill="currentColor" />
      <path d="M12 18v4M8 22h8" />
      <circle cx="15" cy="7" r="0.5" fill="currentColor" opacity="0.5" />
    </svg>
  ),

  // Generic category icon as fallback
  generic: ({ className = "w-6 h-6", size = 24 }: IconProps = {}) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M4 7l1-3h14l1 3M4 7v10a2 2 0 002 2h12a2 2 0 002-2V7M10 11h4" />
      <circle cx="12" cy="15" r="1" fill="currentColor" opacity="0.5" />
    </svg>
  )
};

// Helper function to get icon by slug
export const getCategoryIcon = (slug: string, props?: IconProps) => {
  const iconMap: { [key: string]: keyof typeof CategoryIcons } = {
    'keyboards': 'keyboards',
    'gaming-keyboards': 'keyboards',
    'mice': 'mice',
    'gaming-mice': 'mice',
    'mouse': 'mice',
    'headsets': 'headsets',
    'gaming-headsets': 'headsets',
    'headphones': 'headsets',
    'monitors': 'monitors',
    'gaming-monitors': 'monitors',
    'displays': 'monitors',
    'controllers': 'controllers',
    'gaming-controllers': 'controllers',
    'gamepads': 'controllers',
    'chairs': 'chairs',
    'gaming-chairs': 'chairs',
    'audio': 'audio',
    'speakers': 'audio',
    'sound-systems': 'audio',
    'microphones': 'microphones',
    'mics': 'microphones',
    'streaming-mics': 'microphones',
    'lighting': 'lighting',
    'rgb-lighting': 'lighting',
    'led-strips': 'lighting',
    'desks': 'desks',
    'gaming-desks': 'desks',
    'mousepads': 'mousepads',
    'mouse-pads': 'mousepads',
    'mouse-mats': 'mousepads',
    'webcams': 'webcams',
    'cameras': 'webcams',
    'streaming-cameras': 'webcams',
  };

  const iconKey = iconMap[slug] || 'generic';
  const IconComponent = CategoryIcons[iconKey];
  
  return IconComponent ? IconComponent(props) : CategoryIcons.generic(props);
};