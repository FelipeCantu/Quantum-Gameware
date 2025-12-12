// Category-specific filter configurations
export type FilterType = 'range' | 'multiSelect' | 'singleSelect' | 'boolean';

export interface FilterOption {
  label: string;
  value: string | number | boolean;
}

export interface FilterConfig {
  id: string;
  label: string;
  type: FilterType;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: FilterOption[];
  defaultValue?: any;
}

export interface CategoryFilterConfig {
  categorySlug: string;
  filters: FilterConfig[];
}

export const categoryFilters: CategoryFilterConfig[] = [
  // Gaming Keyboards
  {
    categorySlug: 'keyboards',
    filters: [
      {
        id: 'switchType',
        label: 'Switch Type',
        type: 'multiSelect',
        options: [
          { label: 'Mechanical', value: 'mechanical' },
          { label: 'Membrane', value: 'membrane' },
          { label: 'Optical', value: 'optical' },
          { label: 'Tactile', value: 'tactile' },
          { label: 'Linear', value: 'linear' },
          { label: 'Clicky', value: 'clicky' },
        ],
      },
      {
        id: 'keyboardSize',
        label: 'Keyboard Size',
        type: 'multiSelect',
        options: [
          { label: 'Full Size (100%)', value: 'full-size' },
          { label: 'TKL (80%)', value: 'tkl' },
          { label: '75%', value: '75' },
          { label: '65%', value: '65' },
          { label: '60%', value: '60' },
          { label: '40%', value: '40' },
        ],
      },
      {
        id: 'connection',
        label: 'Connection Type',
        type: 'multiSelect',
        options: [
          { label: 'Wired (USB-C)', value: 'usb-c' },
          { label: 'Wired (USB-A)', value: 'usb-a' },
          { label: 'Wireless (2.4GHz)', value: 'wireless-24ghz' },
          { label: 'Bluetooth', value: 'bluetooth' },
          { label: 'Tri-Mode', value: 'tri-mode' },
        ],
      },
      {
        id: 'rgbLighting',
        label: 'RGB Lighting',
        type: 'singleSelect',
        options: [
          { label: 'All', value: 'all' },
          { label: 'RGB Only', value: 'true' },
          { label: 'No RGB', value: 'false' },
        ],
        defaultValue: 'all',
      },
      {
        id: 'hotSwappable',
        label: 'Hot-Swappable',
        type: 'singleSelect',
        options: [
          { label: 'All', value: 'all' },
          { label: 'Yes', value: 'true' },
          { label: 'No', value: 'false' },
        ],
        defaultValue: 'all',
      },
    ],
  },
  // Gaming Mice
  {
    categorySlug: 'mice',
    filters: [
      {
        id: 'dpiRange',
        label: 'Max DPI',
        type: 'range',
        min: 400,
        max: 30000,
        step: 100,
        unit: 'DPI',
      },
      {
        id: 'weight',
        label: 'Weight',
        type: 'range',
        min: 50,
        max: 150,
        step: 5,
        unit: 'g',
      },
      {
        id: 'connection',
        label: 'Connection Type',
        type: 'multiSelect',
        options: [
          { label: 'Wired', value: 'wired' },
          { label: 'Wireless (2.4GHz)', value: 'wireless-24ghz' },
          { label: 'Bluetooth', value: 'bluetooth' },
          { label: 'Dual Mode', value: 'dual-mode' },
        ],
      },
      {
        id: 'sensorType',
        label: 'Sensor Type',
        type: 'multiSelect',
        options: [
          { label: 'Optical', value: 'optical' },
          { label: 'Laser', value: 'laser' },
        ],
      },
      {
        id: 'handOrientation',
        label: 'Hand Orientation',
        type: 'multiSelect',
        options: [
          { label: 'Ambidextrous', value: 'ambidextrous' },
          { label: 'Right-Handed', value: 'right-handed' },
          { label: 'Left-Handed', value: 'left-handed' },
        ],
      },
      {
        id: 'rgbLighting',
        label: 'RGB Lighting',
        type: 'singleSelect',
        options: [
          { label: 'All', value: 'all' },
          { label: 'RGB Only', value: 'true' },
          { label: 'No RGB', value: 'false' },
        ],
        defaultValue: 'all',
      },
    ],
  },
  // Gaming Headsets
  {
    categorySlug: 'headsets',
    filters: [
      {
        id: 'connection',
        label: 'Connection Type',
        type: 'multiSelect',
        options: [
          { label: 'USB', value: 'usb' },
          { label: '3.5mm', value: '3.5mm' },
          { label: 'Wireless (2.4GHz)', value: 'wireless-24ghz' },
          { label: 'Bluetooth', value: 'bluetooth' },
        ],
      },
      {
        id: 'driverSize',
        label: 'Driver Size',
        type: 'range',
        min: 30,
        max: 60,
        step: 5,
        unit: 'mm',
      },
      {
        id: 'surroundSound',
        label: 'Surround Sound',
        type: 'multiSelect',
        options: [
          { label: 'Stereo', value: 'stereo' },
          { label: '5.1 Surround', value: '5.1' },
          { label: '7.1 Surround', value: '7.1' },
          { label: 'Virtual Surround', value: 'virtual' },
        ],
      },
      {
        id: 'noiseCancellation',
        label: 'Noise Cancellation',
        type: 'singleSelect',
        options: [
          { label: 'All', value: 'all' },
          { label: 'Active NC', value: 'active' },
          { label: 'Passive NC', value: 'passive' },
          { label: 'No NC', value: 'false' },
        ],
        defaultValue: 'all',
      },
      {
        id: 'micType',
        label: 'Microphone',
        type: 'multiSelect',
        options: [
          { label: 'Detachable', value: 'detachable' },
          { label: 'Retractable', value: 'retractable' },
          { label: 'Fixed', value: 'fixed' },
          { label: 'Boom Mic', value: 'boom' },
        ],
      },
    ],
  },
  // Gaming Monitors
  {
    categorySlug: 'monitors',
    filters: [
      {
        id: 'screenSize',
        label: 'Screen Size',
        type: 'range',
        min: 21,
        max: 49,
        step: 1,
        unit: 'inches',
      },
      {
        id: 'refreshRate',
        label: 'Refresh Rate',
        type: 'range',
        min: 60,
        max: 360,
        step: 15,
        unit: 'Hz',
      },
      {
        id: 'resolution',
        label: 'Resolution',
        type: 'multiSelect',
        options: [
          { label: '1080p (Full HD)', value: '1080p' },
          { label: '1440p (QHD)', value: '1440p' },
          { label: '4K (UHD)', value: '4k' },
          { label: '5K', value: '5k' },
          { label: '8K', value: '8k' },
          { label: 'Ultrawide (21:9)', value: 'ultrawide' },
          { label: 'Super Ultrawide (32:9)', value: 'super-ultrawide' },
        ],
      },
      {
        id: 'panelType',
        label: 'Panel Type',
        type: 'multiSelect',
        options: [
          { label: 'IPS', value: 'ips' },
          { label: 'TN', value: 'tn' },
          { label: 'VA', value: 'va' },
          { label: 'OLED', value: 'oled' },
          { label: 'Mini-LED', value: 'mini-led' },
          { label: 'Quantum Dot', value: 'quantum-dot' },
        ],
      },
      {
        id: 'responseTime',
        label: 'Response Time',
        type: 'multiSelect',
        options: [
          { label: '1ms or less', value: '1ms' },
          { label: '2ms', value: '2ms' },
          { label: '4ms', value: '4ms' },
          { label: '5ms+', value: '5ms+' },
        ],
      },
      {
        id: 'curved',
        label: 'Curved Screen',
        type: 'singleSelect',
        options: [
          { label: 'All', value: 'all' },
          { label: 'Curved Only', value: 'true' },
          { label: 'Flat Only', value: 'false' },
        ],
        defaultValue: 'all',
      },
      {
        id: 'hdr',
        label: 'HDR Support',
        type: 'multiSelect',
        options: [
          { label: 'HDR10', value: 'hdr10' },
          { label: 'HDR400', value: 'hdr400' },
          { label: 'HDR600', value: 'hdr600' },
          { label: 'HDR1000', value: 'hdr1000' },
          { label: 'Dolby Vision', value: 'dolby-vision' },
        ],
      },
    ],
  },
  // Gaming Controllers
  {
    categorySlug: 'controllers',
    filters: [
      {
        id: 'connection',
        label: 'Connection Type',
        type: 'multiSelect',
        options: [
          { label: 'Wired (USB)', value: 'wired-usb' },
          { label: 'Wireless (2.4GHz)', value: 'wireless-24ghz' },
          { label: 'Bluetooth', value: 'bluetooth' },
          { label: 'Dual Mode', value: 'dual-mode' },
        ],
      },
      {
        id: 'customizable',
        label: 'Customizable',
        type: 'singleSelect',
        options: [
          { label: 'All', value: 'all' },
          { label: 'Yes', value: 'true' },
          { label: 'No', value: 'false' },
        ],
        defaultValue: 'all',
      },
      {
        id: 'controllerType',
        label: 'Type',
        type: 'multiSelect',
        options: [
          { label: 'Standard', value: 'standard' },
          { label: 'Pro Controller', value: 'pro' },
          { label: 'Arcade Stick', value: 'arcade-stick' },
          { label: 'Racing Wheel', value: 'racing-wheel' },
          { label: 'Flight Stick', value: 'flight-stick' },
        ],
      },
      {
        id: 'backButtons',
        label: 'Back Buttons',
        type: 'singleSelect',
        options: [
          { label: 'All', value: 'all' },
          { label: 'Yes', value: 'true' },
          { label: 'No', value: 'false' },
        ],
        defaultValue: 'all',
      },
      {
        id: 'rgbLighting',
        label: 'RGB Lighting',
        type: 'singleSelect',
        options: [
          { label: 'All', value: 'all' },
          { label: 'RGB Only', value: 'true' },
          { label: 'No RGB', value: 'false' },
        ],
        defaultValue: 'all',
      },
    ],
  },
  // Gaming Chairs
  {
    categorySlug: 'chairs',
    filters: [
      {
        id: 'material',
        label: 'Material',
        type: 'multiSelect',
        options: [
          { label: 'PU Leather', value: 'pu-leather' },
          { label: 'Genuine Leather', value: 'genuine-leather' },
          { label: 'Fabric', value: 'fabric' },
          { label: 'Mesh', value: 'mesh' },
          { label: 'Hybrid', value: 'hybrid' },
        ],
      },
      {
        id: 'maxWeight',
        label: 'Max Weight Capacity',
        type: 'range',
        min: 200,
        max: 500,
        step: 25,
        unit: 'lbs',
      },
      {
        id: 'lumbarSupport',
        label: 'Lumbar Support',
        type: 'singleSelect',
        options: [
          { label: 'All', value: 'all' },
          { label: 'Built-in Adjustable', value: 'adjustable' },
          { label: 'Built-in Fixed', value: 'fixed' },
          { label: 'Pillow', value: 'pillow' },
          { label: 'None', value: 'false' },
        ],
        defaultValue: 'all',
      },
      {
        id: 'armrestType',
        label: 'Armrest Type',
        type: 'multiSelect',
        options: [
          { label: 'Fixed', value: 'fixed' },
          { label: '2D Adjustable', value: '2d' },
          { label: '3D Adjustable', value: '3d' },
          { label: '4D Adjustable', value: '4d' },
        ],
      },
      {
        id: 'reclineAngle',
        label: 'Max Recline Angle',
        type: 'multiSelect',
        options: [
          { label: '90-120°', value: '90-120' },
          { label: '120-135°', value: '120-135' },
          { label: '135-155°', value: '135-155' },
          { label: '155-180°', value: '155-180' },
        ],
      },
    ],
  },
  // Mouse Pads
  {
    categorySlug: 'mousepads',
    filters: [
      {
        id: 'size',
        label: 'Size',
        type: 'multiSelect',
        options: [
          { label: 'Small (< 300mm)', value: 'small' },
          { label: 'Medium (300-450mm)', value: 'medium' },
          { label: 'Large (450-900mm)', value: 'large' },
          { label: 'Extended (900mm+)', value: 'extended' },
          { label: 'Desk Mat', value: 'desk-mat' },
        ],
      },
      {
        id: 'surfaceType',
        label: 'Surface Type',
        type: 'multiSelect',
        options: [
          { label: 'Cloth (Speed)', value: 'cloth-speed' },
          { label: 'Cloth (Control)', value: 'cloth-control' },
          { label: 'Cloth (Balanced)', value: 'cloth-balanced' },
          { label: 'Hard Surface', value: 'hard' },
          { label: 'Hybrid', value: 'hybrid' },
          { label: 'Glass', value: 'glass' },
        ],
      },
      {
        id: 'rgbLighting',
        label: 'RGB Lighting',
        type: 'singleSelect',
        options: [
          { label: 'All', value: 'all' },
          { label: 'RGB Only', value: 'true' },
          { label: 'No RGB', value: 'false' },
        ],
        defaultValue: 'all',
      },
      {
        id: 'thickness',
        label: 'Thickness',
        type: 'range',
        min: 2,
        max: 6,
        step: 0.5,
        unit: 'mm',
      },
      {
        id: 'stitchedEdges',
        label: 'Stitched Edges',
        type: 'singleSelect',
        options: [
          { label: 'All', value: 'all' },
          { label: 'Yes', value: 'true' },
          { label: 'No', value: 'false' },
        ],
        defaultValue: 'all',
      },
    ],
  },
  // Gaming Microphones
  {
    categorySlug: 'microphones',
    filters: [
      {
        id: 'connection',
        label: 'Connection Type',
        type: 'multiSelect',
        options: [
          { label: 'USB', value: 'usb' },
          { label: 'XLR', value: 'xlr' },
          { label: '3.5mm', value: '3.5mm' },
          { label: 'Wireless', value: 'wireless' },
        ],
      },
      {
        id: 'polarPattern',
        label: 'Polar Pattern',
        type: 'multiSelect',
        options: [
          { label: 'Cardioid', value: 'cardioid' },
          { label: 'Omnidirectional', value: 'omnidirectional' },
          { label: 'Bidirectional', value: 'bidirectional' },
          { label: 'Multi-Pattern', value: 'multi-pattern' },
        ],
      },
      {
        id: 'sampleRate',
        label: 'Sample Rate',
        type: 'multiSelect',
        options: [
          { label: '48 kHz', value: '48khz' },
          { label: '96 kHz', value: '96khz' },
          { label: '192 kHz', value: '192khz' },
        ],
      },
      {
        id: 'micType',
        label: 'Microphone Type',
        type: 'multiSelect',
        options: [
          { label: 'Condenser', value: 'condenser' },
          { label: 'Dynamic', value: 'dynamic' },
          { label: 'Ribbon', value: 'ribbon' },
        ],
      },
      {
        id: 'mountType',
        label: 'Mount Type',
        type: 'multiSelect',
        options: [
          { label: 'Desktop Stand', value: 'desktop' },
          { label: 'Boom Arm', value: 'boom-arm' },
          { label: 'Shock Mount', value: 'shock-mount' },
          { label: 'Built-in', value: 'built-in' },
        ],
      },
    ],
  },
  // Gaming Speakers
  {
    categorySlug: 'speakers',
    filters: [
      {
        id: 'configuration',
        label: 'Configuration',
        type: 'multiSelect',
        options: [
          { label: '2.0 (Stereo)', value: '2.0' },
          { label: '2.1 (Stereo + Sub)', value: '2.1' },
          { label: '5.1 Surround', value: '5.1' },
          { label: '7.1 Surround', value: '7.1' },
          { label: 'Soundbar', value: 'soundbar' },
        ],
      },
      {
        id: 'powerOutput',
        label: 'Total Power Output',
        type: 'range',
        min: 10,
        max: 200,
        step: 10,
        unit: 'W',
      },
      {
        id: 'rgbLighting',
        label: 'RGB Lighting',
        type: 'singleSelect',
        options: [
          { label: 'All', value: 'all' },
          { label: 'RGB Only', value: 'true' },
          { label: 'No RGB', value: 'false' },
        ],
        defaultValue: 'all',
      },
      {
        id: 'connection',
        label: 'Connection Type',
        type: 'multiSelect',
        options: [
          { label: 'USB', value: 'usb' },
          { label: '3.5mm AUX', value: '3.5mm' },
          { label: 'Bluetooth', value: 'bluetooth' },
          { label: 'Optical', value: 'optical' },
          { label: 'RCA', value: 'rca' },
        ],
      },
      {
        id: 'features',
        label: 'Features',
        type: 'multiSelect',
        options: [
          { label: 'Remote Control', value: 'remote' },
          { label: 'Built-in EQ', value: 'eq' },
          { label: 'Bass Boost', value: 'bass-boost' },
          { label: 'Volume Knob', value: 'volume-knob' },
        ],
      },
    ],
  },
  // Gaming Accessories
  {
    categorySlug: 'accessories',
    filters: [
      {
        id: 'accessoryType',
        label: 'Type',
        type: 'multiSelect',
        options: [
          { label: 'Cables', value: 'cables' },
          { label: 'LED Strips', value: 'led-strips' },
          { label: 'USB Hubs', value: 'usb-hubs' },
          { label: 'Monitor Mounts', value: 'monitor-mounts' },
          { label: 'Webcams', value: 'webcams' },
          { label: 'Cooling Pads', value: 'cooling-pads' },
          { label: 'Cable Management', value: 'cable-management' },
          { label: 'Controller Grips', value: 'controller-grips' },
          { label: 'Headset Stands', value: 'headset-stands' },
        ],
      },
      {
        id: 'rgbLighting',
        label: 'RGB Lighting',
        type: 'singleSelect',
        options: [
          { label: 'All', value: 'all' },
          { label: 'RGB Only', value: 'true' },
          { label: 'No RGB', value: 'false' },
        ],
        defaultValue: 'all',
      },
    ],
  },
];

// Helper function to get filters for a specific category
export function getFiltersForCategory(categorySlug: string): FilterConfig[] {
  const categoryConfig = categoryFilters.find(
    (config) => config.categorySlug === categorySlug
  );
  return categoryConfig?.filters || [];
}

// Helper function to check if a category has specific filters
export function hasCustomFilters(categorySlug: string): boolean {
  return categoryFilters.some((config) => config.categorySlug === categorySlug);
}
