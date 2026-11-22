/**
 * Seed ~60 extra products into Sanity (Nov 2026 catalog expansion).
 *
 *   npm run seed:products                              # write to Sanity
 *   npx tsx scripts/seed-products-2026.ts --dry        # show what would be created
 *   npx tsx scripts/seed-products-2026.ts --validate   # offline data check, no network
 *
 * Safe to run more than once: products whose slug already exists are skipped,
 * and every product gets a deterministic _id used with createIfNotExists.
 * No images are set, so the store shows its built-in placeholder.
 */
import dotenv from 'dotenv';
import { createClient } from '@sanity/client';

dotenv.config({ path: '.env.local' });

type Seed = {
  name: string;
  category: string; // category slug
  brand: string; // brand name (created if missing)
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  compatibility?: string[];
  attrs?: Record<string, unknown>;
  rating: number;
  isNew?: boolean;
  isFeatured?: boolean;
  inStock?: boolean;
};

const PC = ['pc'];
const MULTI = ['pc', 'ps5', 'xbox-series', 'switch', 'mobile'];
const DISPLAY = ['pc', 'ps5', 'xbox-series'];

const products: Seed[] = [
  // ───────────── Webcams (new category) ─────────────
  { name: 'Logitech MX Brio', category: 'webcams', brand: 'Logitech', price: 199.99, rating: 4.6, isNew: true, isFeatured: true,
    description: '4K Ultra HD webcam with an AI-tuned image pipeline that keeps faces bright and natural, even in mixed or backlit rooms.',
    features: ['4K30 / 1080p60 capture', 'Adjustable 65°/78°/90° field of view', 'Dual beamforming mics', 'Built-in privacy shutter', 'USB-C'], compatibility: PC },
  { name: 'Elgato Facecam MK.2', category: 'webcams', brand: 'Elgato', price: 149.99, rating: 4.7, isFeatured: true,
    description: 'Purpose-built streaming webcam: uncompressed 1080p60 from a Sony STARVIS sensor with full manual control in Camera Hub.',
    features: ['1080p60 uncompressed', 'Sony STARVIS sensor', 'Digital pan / tilt / zoom', 'HDR', 'Onboard settings memory'], compatibility: PC },
  { name: 'Elgato Facecam 4K', category: 'webcams', brand: 'Elgato', price: 199.99, rating: 4.6, isNew: true,
    description: 'Fixed-frame 4K60 camera built around a Sony STARVIS 2 sensor for the cleanest picture at a desk setup.',
    features: ['4K60 capture', 'Sony STARVIS 2 sensor', 'Manual exposure and white balance', 'Stream Deck integration'], compatibility: PC },
  { name: 'OBSBOT Tiny 2', category: 'webcams', brand: 'OBSBOT', price: 329.0, rating: 4.5,
    description: 'AI-tracking 4K PTZ webcam on a motorized gimbal that follows you around the room and frames you automatically.',
    features: ['4K30 with 1/1.5" sensor', 'AI subject tracking', 'Gesture and voice control', '2-axis gimbal', 'Dual omni mics'], compatibility: PC },
  { name: 'Razer Kiyo Pro Ultra', category: 'webcams', brand: 'Razer', price: 299.99, rating: 4.4,
    description: 'Large 1/1.2" sensor and an f/1.7 lens give this webcam one of the cleanest low-light images in its class.',
    features: ['1/1.2" STARVIS 2 sensor', '4K30 / 1080p60', 'f/1.7 aperture', '82° field of view', 'Uncompressed 4K output'], compatibility: PC },
  { name: 'Logitech StreamCam', category: 'webcams', brand: 'Logitech', price: 169.99, rating: 4.3,
    description: 'Smooth 1080p60 streaming camera that flips to vertical for TikTok and Shorts, with smart auto-focus and exposure.',
    features: ['1080p60', 'Vertical (portrait) mode', 'Face-tracking auto exposure', 'USB-C', 'Monitor and tripod mounts'], compatibility: PC },
  { name: 'Logitech C920s HD Pro', category: 'webcams', brand: 'Logitech', price: 69.99, rating: 4.4,
    description: 'The reliable best-seller: crisp 1080p video, stereo mics and a privacy shade at an entry-level price.',
    features: ['1080p30', 'Auto light correction', 'Stereo mics', 'Privacy shade'], compatibility: PC },

  // ───────────── VR headsets (new category) ─────────────
  { name: 'Meta Quest 3 512GB', category: 'vr-headsets', brand: 'Meta', price: 599.99, rating: 4.7, isFeatured: true,
    description: 'Standalone mixed-reality headset with pancake lenses, full-colour passthrough and the largest library of VR games.',
    features: ['2064×2208 per eye', 'Pancake lenses', 'Full-colour mixed reality', 'Snapdragon XR2 Gen 2', 'PC VR via Link / Air Link', '512GB storage'], compatibility: ['pc', 'mobile'] },
  { name: 'Meta Quest 3S 128GB', category: 'vr-headsets', brand: 'Meta', price: 349.99, rating: 4.5,
    description: 'The most affordable way into the Quest library: same XR2 Gen 2 chip and mixed reality as Quest 3, with Fresnel lenses.',
    features: ['1832×1920 per eye', 'Snapdragon XR2 Gen 2', 'Mixed-reality passthrough', 'Touch Plus controllers', '128GB storage'], compatibility: ['pc', 'mobile'] },
  { name: 'PlayStation VR2', category: 'vr-headsets', brand: 'PlayStation', price: 399.99, rating: 4.4,
    description: 'OLED HDR headset for PS5 with eye tracking and headset haptics; also plays SteamVR games with the PC adapter.',
    features: ['4K HDR OLED (2000×2040 per eye)', 'Eye tracking with foveated rendering', 'Sense controllers with adaptive triggers', 'Headset haptics', 'Works on PC with adapter'], compatibility: ['ps5', 'pc'] },
  { name: 'Valve Steam Frame 256GB', category: 'vr-headsets', brand: 'Valve', price: 1059.0, rating: 4.6, isNew: true, isFeatured: true,
    description: 'Valve’s wireless, streaming-first headset that plays your Steam library standalone or streamed from your gaming PC.',
    features: ['Standalone and wireless PC streaming', 'Inside-out tracking (no base stations)', 'Eye-tracked foveated streaming', 'Includes Half-Life: Alyx', '256GB storage'], compatibility: PC },
  { name: 'Valve Index Headset', category: 'vr-headsets', brand: 'Valve', price: 399.2, originalPrice: 499.0, rating: 4.5,
    description: 'Final-stock sale on the enthusiast tethered PC headset with 144Hz panels and a wide field of view. Requires base stations.',
    features: ['Up to 144Hz refresh', '130° field of view', 'Off-ear speakers', 'Lighthouse tracking', 'DisplayPort + USB 3.0'], compatibility: PC },
  { name: 'HTC Vive XR Elite', category: 'vr-headsets', brand: 'HTC', price: 899.0, rating: 4.1,
    description: 'Compact convertible XR headset that switches from standalone to PC VR and folds to a glasses-style form without its battery.',
    features: ['1920×1920 per eye, 90Hz', 'Colour passthrough', 'Hot-swappable battery cradle', 'Diopter dials (no glasses needed)', 'PC VR streaming'], compatibility: ['pc', 'mobile'] },

  // ───────────── Keyboards (+4) ─────────────
  { name: 'Wooting 80HE', category: 'keyboards', brand: 'Wooting', price: 199.99, rating: 4.8, isNew: true, isFeatured: true,
    description: 'Hall-effect analog keyboard with Rapid Trigger and per-key actuation from 0.1 to 4.0mm, in a 75% aluminium case.',
    features: ['Lekker magnetic switches', 'Rapid Trigger', '8kHz polling', 'Analog input', 'Gasket-mounted aluminium case'], compatibility: PC,
    attrs: { switchType: ['linear'], keyboardSize: '75', hotSwappable: true, connection: ['usb-c'], rgbLighting: true } },
  { name: 'Logitech G Pro X TKL Lightspeed', category: 'keyboards', brand: 'Logitech', price: 199.99, rating: 4.5,
    description: 'Tournament-grade tenkeyless with Lightspeed wireless, Bluetooth and a game-mode switch built for esports stages.',
    features: ['Lightspeed 2.4GHz + Bluetooth', 'GX mechanical switches', 'Dedicated media controls', 'Up to 50h battery'], compatibility: PC,
    attrs: { switchType: ['mechanical', 'tactile'], keyboardSize: 'tkl', hotSwappable: false, connection: ['wireless-24ghz', 'bluetooth', 'usb-c'], rgbLighting: true } },
  { name: 'Razer Huntsman V3 Pro TKL', category: 'keyboards', brand: 'Razer', price: 219.99, rating: 4.6,
    description: 'Analog optical switches with adjustable actuation and Rapid Trigger, plus a magnetic wrist rest and aluminium top plate.',
    features: ['Analog optical switches', 'Adjustable actuation 0.1–4.0mm', 'Rapid Trigger', 'Doubleshot PBT keycaps', 'Magnetic wrist rest'], compatibility: PC,
    attrs: { switchType: ['optical', 'linear'], keyboardSize: 'tkl', hotSwappable: false, connection: ['usb-c'], rgbLighting: true } },
  { name: 'Corsair K65 Plus Wireless', category: 'keyboards', brand: 'Corsair', price: 159.99, rating: 4.5,
    description: 'Gasket-mounted 75% board with pre-lubed linear switches and tri-mode wireless for a quiet, premium typing feel.',
    features: ['Pre-lubed MLX Red linear switches', 'Hot-swappable', 'Tri-mode: 2.4GHz / Bluetooth / USB', 'Up to 266h battery'], compatibility: PC,
    attrs: { switchType: ['mechanical', 'linear'], keyboardSize: '75', hotSwappable: true, connection: ['tri-mode'], rgbLighting: true } },

  // ───────────── Mice (+5) ─────────────
  { name: 'Razer Viper V3 Pro', category: 'mice', brand: 'Razer', price: 159.99, rating: 4.8, isFeatured: true,
    description: '54g symmetrical esports mouse with the Focus Pro 35K sensor and true 8000Hz wireless polling.',
    features: ['54g', 'Focus Pro 35K Gen-2 sensor', '8kHz HyperPolling wireless', 'Optical switches Gen-3', '95h battery'], compatibility: PC,
    attrs: { dpiRange: '100 - 35,000', weight: 54, sensorType: 'optical', handOrientation: 'ambidextrous', connection: ['wireless-24ghz', 'wired'], rgbLighting: false } },
  { name: 'Logitech G502 X Plus', category: 'mice', brand: 'Logitech', price: 159.99, rating: 4.6,
    description: 'The iconic G502 shape rebuilt with hybrid optical-mechanical switches, Lightspeed wireless and RGB.',
    features: ['HERO 25K sensor', 'Lightforce hybrid switches', '13 programmable controls', 'Lightspeed wireless', 'LIGHTSYNC RGB'], compatibility: PC,
    attrs: { dpiRange: '100 - 25,600', weight: 106, sensorType: 'optical', handOrientation: 'right-handed', connection: ['wireless-24ghz', 'wired'], rgbLighting: true } },
  { name: 'SteelSeries Aerox 5 Wireless', category: 'mice', brand: 'SteelSeries', price: 139.99, rating: 4.4,
    description: 'Ultra-light 74g honeycomb mouse with nine buttons, water resistance and up to 180 hours of battery.',
    features: ['TrueMove Air sensor', '9 programmable buttons', 'IP54 water resistance', '2.4GHz + Bluetooth', '180h battery'], compatibility: PC,
    attrs: { dpiRange: '100 - 18,000', weight: 74, sensorType: 'optical', handOrientation: 'right-handed', connection: ['dual-mode'], rgbLighting: true } },
  { name: 'Zowie EC2-CW', category: 'mice', brand: 'Zowie', price: 149.99, rating: 4.5,
    description: 'Pro-favourite ergonomic shape gone wireless, with a plug-and-play receiver dock and no software required.',
    features: ['Ergonomic right-hand shape', 'Enhanced receiver dock', 'Driver-free', '3370 sensor', '24-step scroll wheel'], compatibility: PC,
    attrs: { dpiRange: '400 - 3,200', weight: 77, sensorType: 'optical', handOrientation: 'right-handed', connection: ['wireless-24ghz', 'wired'], rgbLighting: false } },
  { name: 'Glorious Model D 2 Pro', category: 'mice', brand: 'Glorious', price: 119.99, rating: 4.4,
    description: 'Solid-shell ergonomic wireless mouse at 58g with the BAMF 2.0 sensor and optional 4K/8K polling.',
    features: ['58g solid shell', 'BAMF 2.0 26K sensor', '4K/8K polling capable', 'Optical switches', '80h battery'], compatibility: PC,
    attrs: { dpiRange: '100 - 26,000', weight: 58, sensorType: 'optical', handOrientation: 'right-handed', connection: ['wireless-24ghz', 'wired'], rgbLighting: false } },

  // ───────────── Monitors (+4) ─────────────
  { name: 'Alienware AW2725DF', category: 'monitors', brand: 'Alienware', price: 699.99, originalPrice: 899.99, rating: 4.7, isFeatured: true,
    description: '27" QD-OLED at a blistering 360Hz with 0.03ms response for one of the most responsive 1440p images you can buy.',
    features: ['27" QD-OLED', '2560×1440 @ 360Hz', '0.03ms GtG', 'VESA DisplayHDR True Black 400', 'FreeSync Premium Pro'], compatibility: DISPLAY,
    attrs: { screenSize: 27, refreshRate: 360, resolution: ['1440p'], panelType: ['oled', 'quantum-dot'], responseTime: '1ms', curved: false, hdr: ['hdr10', 'hdr400'] } },
  { name: 'MSI MPG 271QRX QD-OLED', category: 'monitors', brand: 'MSI', price: 749.99, rating: 4.6,
    description: '27" 360Hz QD-OLED with graphene heatsink cooling and OLED Care to keep burn-in at bay.',
    features: ['27" QD-OLED', '1440p @ 360Hz', '0.03ms GtG', 'USB-C 90W', 'OLED Care 2.0'], compatibility: DISPLAY,
    attrs: { screenSize: 27, refreshRate: 360, resolution: ['1440p'], panelType: ['oled', 'quantum-dot'], responseTime: '1ms', curved: false, hdr: ['hdr10', 'hdr400'] } },
  { name: 'BenQ Zowie XL2566K', category: 'monitors', brand: 'BenQ', price: 499.99, rating: 4.5,
    description: '24.5" 360Hz TN panel with DyAc+ motion clarity, a tournament standard for Counter-Strike and Valorant.',
    features: ['24.5" Fast TN', '1080p @ 360Hz', 'DyAc+ motion clarity', 'S.Switch puck', 'Height and tilt stand'], compatibility: PC,
    attrs: { screenSize: 24.5, refreshRate: 360, resolution: ['1080p'], panelType: ['tn'], responseTime: '1ms', curved: false } },
  { name: 'LG UltraGear 32GS95UE', category: 'monitors', brand: 'LG', price: 1299.99, originalPrice: 1399.99, rating: 4.6, isNew: true,
    description: 'Dual-mode 32" OLED: play at 4K 240Hz or switch to 1080p 480Hz for competitive games at the press of a button.',
    features: ['32" WOLED', '4K @ 240Hz / 1080p @ 480Hz dual mode', '0.03ms GtG', 'Pixel Sound built-in speakers', 'DisplayPort 1.4 + HDMI 2.1'], compatibility: DISPLAY,
    attrs: { screenSize: 32, refreshRate: 240, resolution: ['4k', '1080p'], panelType: ['oled'], responseTime: '1ms', curved: false, hdr: ['hdr10', 'hdr400'] } },

  // ───────────── Headsets (+5) ─────────────
  { name: 'SteelSeries Arctis Nova 7', category: 'headsets', brand: 'SteelSeries', price: 179.99, rating: 4.6,
    description: 'Simultaneous 2.4GHz and Bluetooth audio so you can game and take calls at once, with 38 hours of battery.',
    features: ['2.4GHz + Bluetooth simultaneous', '38h battery', 'Retractable ClearCast Gen 2 mic', 'Spatial audio', 'USB-C fast charge'], compatibility: MULTI,
    attrs: { connection: ['wireless-24ghz', 'bluetooth'], surroundSound: ['virtual'], noiseCancellation: 'passive', micType: ['retractable'], driverSize: '40mm' } },
  { name: 'Logitech G Pro X 2 Lightspeed', category: 'headsets', brand: 'Logitech', price: 249.99, rating: 4.6, isFeatured: true,
    description: 'Pro esports headset with 50mm graphene drivers, tri-mode connectivity and over 50 hours of battery.',
    features: ['50mm graphene drivers', 'Lightspeed / Bluetooth / 3.5mm', '50h+ battery', 'Detachable 6mm mic', 'DTS Headphone:X 2.0'], compatibility: MULTI,
    attrs: { connection: ['wireless-24ghz', 'bluetooth', '3.5mm'], surroundSound: ['7.1', 'virtual'], noiseCancellation: 'passive', micType: ['detachable'], driverSize: '50mm' } },
  { name: 'Razer BlackShark V2 Pro', category: 'headsets', brand: 'Razer', price: 199.99, rating: 4.5,
    description: 'Lightweight esports headset with TriForce Titanium drivers and a super-wideband HyperClear mic.',
    features: ['TriForce Titanium 50mm drivers', 'HyperSpeed wireless + Bluetooth', '70h battery', 'Detachable super-wideband mic', 'Memory foam cushions'], compatibility: MULTI,
    attrs: { connection: ['wireless-24ghz', 'bluetooth'], surroundSound: ['stereo', 'virtual'], noiseCancellation: 'passive', micType: ['detachable'], driverSize: '50mm' } },
  { name: 'HyperX Cloud III', category: 'headsets', brand: 'HyperX', price: 99.99, rating: 4.5,
    description: 'The legendary Cloud comfort, updated with angled 53mm drivers and a clearer 10mm noise-cancelling mic.',
    features: ['Angled 53mm drivers', 'Memory foam and aluminium frame', 'DTS Headphone:X', 'USB-C, USB-A and 3.5mm'], compatibility: MULTI,
    attrs: { connection: ['usb', '3.5mm'], surroundSound: ['stereo', 'virtual'], noiseCancellation: 'passive', micType: ['detachable'], driverSize: '53mm' } },
  { name: 'Turtle Beach Stealth 700 Gen 3', category: 'headsets', brand: 'Turtle Beach', price: 199.99, rating: 4.4, isNew: true,
    description: 'Console-first wireless headset with dual-source wireless, 60mm Eclipse drivers and up to 80 hours of battery.',
    features: ['60mm Eclipse drivers', 'Dual-source wireless + Bluetooth', '80h battery', 'Flip-to-mute mic', 'Swarm II app EQ'], compatibility: MULTI,
    attrs: { connection: ['wireless-24ghz', 'bluetooth'], surroundSound: ['virtual'], noiseCancellation: 'passive', micType: ['boom'], driverSize: '60mm' } },

  // ───────────── Accessories (+5) ─────────────
  { name: 'Elgato Stream Deck +', category: 'accessories', brand: 'Elgato', price: 199.99, rating: 4.7,
    description: 'Eight LCD keys plus four tactile dials and a touch strip for mixing audio, lights and scenes without leaving the game.',
    features: ['8 customizable LCD keys', '4 push dials', 'Touch strip', 'Hundreds of plugins'], compatibility: PC,
    attrs: { accessoryType: ['usb-hubs'] } },
  { name: 'Govee Glide Hexa Pro', category: 'accessories', brand: 'Govee', price: 199.99, rating: 4.4,
    description: 'Modular 3D hexagon wall lights with music sync and game-reactive scenes for the back of any battlestation.',
    features: ['10 3D hexagon panels', 'RGBIC multi-colour', 'Music sync', 'Razer Chroma support', 'App and voice control'], compatibility: PC,
    attrs: { accessoryType: ['led-strips'], rgbLighting: true } },
  { name: 'Anker 7-in-1 USB-C Hub', category: 'accessories', brand: 'Anker', price: 35.99, rating: 4.5,
    description: 'Compact aluminium hub adding 4K HDMI, 100W pass-through charging, SD readers and two USB-A ports.',
    features: ['4K HDMI', '100W PD pass-through', 'SD / microSD', '2× USB-A 5Gbps', 'USB-C data'], compatibility: PC,
    attrs: { accessoryType: ['usb-hubs'] } },
  { name: 'Ergotron LX Desk Monitor Arm', category: 'accessories', brand: 'Ergotron', price: 209.0, rating: 4.8,
    description: 'The benchmark single monitor arm: smooth motion, 360° rotation and cable routing for screens up to 34".',
    features: ['Supports up to 34" / 11.3kg', 'Lift, tilt, pan and rotate', 'Integrated cable management', '10-year warranty'], compatibility: PC,
    attrs: { accessoryType: ['monitor-mounts', 'cable-management'] } },
  { name: 'Corsair ST100 RGB Headset Stand', category: 'accessories', brand: 'Corsair', price: 59.99, rating: 4.4,
    description: 'Aluminium headset stand with RGB lighting, a 3.5mm surround-sound jack and two USB pass-through ports.',
    features: ['Durable aluminium build', '7.1 surround 3.5mm jack', '2× USB 3.1 ports', 'iCUE RGB'], compatibility: PC,
    attrs: { accessoryType: ['headset-stands', 'usb-hubs'], rgbLighting: true } },

  // ───────────── Chairs (+5) ─────────────
  { name: 'Herman Miller Vantum', category: 'chairs', brand: 'Herman Miller', price: 995.0, rating: 4.6,
    description: 'Gaming chair designed around forward-leaning play, with a flexible seat edge and spine-supporting back.',
    features: ['Forward-tilt posture support', 'Flexible seat edge', 'Adjustable lumbar', '12-year warranty'],
    attrs: { material: ['mesh', 'fabric'], maxWeight: 136, lumbarSupport: 'adjustable', armrestType: ['4d'], reclineAngle: '90-120' } },
  { name: 'Steelcase Gesture', category: 'chairs', brand: 'Steelcase', price: 1449.0, rating: 4.7,
    description: 'Office icon adopted by gamers for 360° arms that follow you from keyboard to controller to phone.',
    features: ['360° universal arms', 'LiveBack flex back', 'Core-equalizer recline', 'Lifetime warranty'],
    attrs: { material: ['fabric'], maxWeight: 181, lumbarSupport: 'adjustable', armrestType: ['4d'], reclineAngle: '90-120' } },
  { name: 'Noblechairs Hero', category: 'chairs', brand: 'Noblechairs', price: 549.0, rating: 4.4,
    description: 'Racing-style chair with cold-foam padding, integrated adjustable lumbar and a 135° recline.',
    features: ['Cold-foam padding', 'Built-in adjustable lumbar', '4D armrests', 'Class 4 gas lift'],
    attrs: { material: ['pu-leather'], maxWeight: 150, lumbarSupport: 'adjustable', armrestType: ['4d'], reclineAngle: '120-135' } },
  { name: 'DXRacer Craft', category: 'chairs', brand: 'DXRacer', price: 499.0, rating: 4.2,
    description: 'Customizable racing chair with a wide seat, memory-foam headrest and up to 135° recline.',
    features: ['Wide seat pan', 'Memory-foam headrest', 'Lumbar pillow', '135° recline'],
    attrs: { material: ['pu-leather'], maxWeight: 113, lumbarSupport: 'pillow', armrestType: ['3d'], reclineAngle: '120-135' } },
  { name: 'Corsair TC100 Relaxed', category: 'chairs', brand: 'Corsair', price: 299.99, rating: 4.3,
    description: 'Value chair with a roomy seat, breathable fabric and a lumbar pillow, built for long relaxed sessions.',
    features: ['Wide relaxed seat', 'Breathable fabric', 'Lumbar and neck pillows', '160° recline'],
    attrs: { material: ['fabric'], maxWeight: 120, lumbarSupport: 'pillow', armrestType: ['2d'], reclineAngle: '155-180' } },

  // ───────────── Microphones (+5) ─────────────
  { name: 'Shure MV7+', category: 'microphones', brand: 'Shure', price: 279.0, rating: 4.7, isNew: true, isFeatured: true,
    description: 'Hybrid USB-C/XLR dynamic podcast mic with a real-time denoiser, digital pop filter and touch LED panel.',
    features: ['USB-C and XLR outputs', 'Real-time denoiser', 'Digital pop filter', 'Auto Level Mode', 'Customizable LED touch panel'], compatibility: PC,
    attrs: { micType: ['dynamic'], polarPattern: ['cardioid'], connection: ['usb', 'xlr'], sampleRate: ['48khz'], mountType: ['boom-arm'] } },
  { name: 'Rode PodMic USB', category: 'microphones', brand: 'Rode', price: 199.0, rating: 4.6,
    description: 'Broadcast dynamic mic with both USB-C and XLR, plus Revolution Preamp and APHEX processing built in.',
    features: ['USB-C and XLR', 'Revolution Preamp', 'APHEX processing', 'Internal pop filter', 'Zero-latency monitoring'], compatibility: PC,
    attrs: { micType: ['dynamic'], polarPattern: ['cardioid'], connection: ['usb', 'xlr'], sampleRate: ['48khz'], mountType: ['boom-arm'] } },
  { name: 'HyperX QuadCast 2', category: 'microphones', brand: 'HyperX', price: 139.99, rating: 4.5, isNew: true,
    description: 'Streamer-favourite RGB condenser with four polar patterns, tap-to-mute and high-resolution recording.',
    features: ['32-bit / 192kHz', '4 polar patterns', 'Tap-to-mute sensor', 'Built-in shock mount', 'RGB lighting'], compatibility: ['pc', 'ps5', 'mobile'],
    attrs: { micType: ['condenser'], polarPattern: ['multi-pattern'], connection: ['usb'], sampleRate: ['192khz'], mountType: ['desktop', 'shock-mount'] } },
  { name: 'Audio-Technica AT2020USB-X', category: 'microphones', brand: 'Audio-Technica', price: 149.0, rating: 4.5,
    description: 'The classic AT2020 studio condenser in USB-C form, with touch mute, mix control and 24-bit/96kHz audio.',
    features: ['24-bit / 96kHz', 'Touch-sensitive mute', 'Headphone mix control', 'USB-C'], compatibility: PC,
    attrs: { micType: ['condenser'], polarPattern: ['cardioid'], connection: ['usb'], sampleRate: ['96khz'], mountType: ['desktop'] } },
  { name: 'Samson Q2U', category: 'microphones', brand: 'Samson', price: 69.99, rating: 4.5,
    description: 'Budget dynamic mic with USB and XLR, the easiest first upgrade from a headset mic.',
    features: ['USB and XLR', 'Dynamic capsule rejects room noise', 'Headphone jack', 'Includes stand and clip'], compatibility: PC,
    attrs: { micType: ['dynamic'], polarPattern: ['cardioid'], connection: ['usb', 'xlr'], sampleRate: ['48khz'], mountType: ['desktop', 'boom-arm'] } },

  // ───────────── Controllers (+5) ─────────────
  { name: 'Xbox Wireless Controller', category: 'controllers', brand: 'Xbox', price: 64.99, rating: 4.7,
    description: 'The standard for PC and Xbox: hybrid D-pad, textured grips, a Share button and Bluetooth for phones and tablets.',
    features: ['Hybrid D-pad', 'Textured grips', 'Share button', 'Bluetooth + Xbox Wireless', 'USB-C'], compatibility: ['pc', 'xbox-series', 'xbox-one', 'mobile'],
    attrs: { controllerType: ['standard'], customizable: false, backButtons: false, connection: ['wireless-24ghz', 'bluetooth', 'wired-usb'] } },
  { name: 'Razer Wolverine V3 Pro', category: 'controllers', brand: 'Razer', price: 199.99, rating: 4.5,
    description: 'Pro Xbox/PC controller with Hall-effect sticks, mouse-click buttons, 8kHz wired polling and six remappable extras.',
    features: ['Hall-effect thumbsticks', 'Mecha-tactile action buttons', 'Trigger stops', '6 remappable buttons', '8kHz polling (wired)'], compatibility: ['pc', 'xbox-series', 'xbox-one'],
    attrs: { controllerType: ['pro'], customizable: true, backButtons: true, connection: ['wireless-24ghz', 'wired-usb'] } },
  { name: 'SCUF Reflex Pro', category: 'controllers', brand: 'SCUF', price: 229.99, rating: 4.4,
    description: 'Performance PS5 controller with four rear paddles, instant triggers and interchangeable thumbsticks.',
    features: ['4 remappable paddles', 'Instant triggers', 'Interchangeable sticks', 'High-performance grip'], compatibility: ['ps5', 'pc'],
    attrs: { controllerType: ['pro'], customizable: true, backButtons: true, connection: ['bluetooth', 'wired-usb'] } },
  { name: '8BitDo Ultimate 2 Wireless', category: 'controllers', brand: '8BitDo', price: 59.99, rating: 4.6, isNew: true,
    description: 'TMR drift-resistant sticks, RGB ring lights and a charging dock at a price that undercuts first-party pads.',
    features: ['TMR thumbsticks', 'Hall-effect triggers with trigger locks', '2 back paddles', 'Charging dock', '2.4GHz / Bluetooth / wired'], compatibility: ['pc', 'switch', 'mobile'],
    attrs: { controllerType: ['pro'], customizable: true, backButtons: true, connection: ['dual-mode', 'wired-usb'], rgbLighting: true } },
  { name: 'Thrustmaster T248', category: 'controllers', brand: 'Thrustmaster', price: 399.99, rating: 4.4,
    description: 'Hybrid force-feedback racing wheel with magnetic paddle shifters, a live-telemetry screen and a three-pedal set.',
    features: ['Hybrid drive force feedback', 'Magnetic paddle shifters', 'Telemetry display', '3-pedal set included'], compatibility: ['pc', 'ps5', 'ps4'],
    attrs: { controllerType: ['racing-wheel'], customizable: true, backButtons: false, connection: ['wired-usb'] } },

  // ───────────── Mouse pads (+5) ─────────────
  { name: 'Logitech G640', category: 'mousepads', brand: 'Logitech', price: 39.99, rating: 4.6,
    description: 'Large balanced cloth pad tuned for consistent glide and stopping power, a pick of many pro players.',
    features: ['460 × 400mm', 'Balanced cloth surface', 'Rubber base', 'Rolls flat for travel'],
    attrs: { size: ['large'], surfaceType: ['cloth-balanced'], thickness: '3mm', stitchedEdges: false } },
  { name: 'Artisan Ninja FX Zero', category: 'mousepads', brand: 'Artisan', price: 59.0, rating: 4.8,
    description: 'Japanese-made balanced pad with silky glide and excellent micro-adjust control; a cult enthusiast favourite.',
    features: ['Made in Japan', 'Balanced speed / control', 'Multiple foam firmness options', 'Stitched edges'],
    attrs: { size: ['large'], surfaceType: ['cloth-balanced'], thickness: '4mm', stitchedEdges: true } },
  { name: 'SteelSeries QcK Heavy XXL', category: 'mousepads', brand: 'SteelSeries', price: 49.99, rating: 4.6,
    description: 'Extra-thick 6mm desk-covering cloth pad for maximum comfort and control.',
    features: ['900 × 400mm', '6mm thick', 'Micro-woven cloth', 'Non-slip rubber base'],
    attrs: { size: ['extended', 'desk-mat'], surfaceType: ['cloth-control'], thickness: '6mm', stitchedEdges: true } },
  { name: 'Razer Atlas', category: 'mousepads', brand: 'Razer', price: 99.99, rating: 4.4,
    description: 'Tempered glass pad with a micro-etched surface for ultra-fast, effortless glide that never wears out.',
    features: ['Tempered glass', 'Micro-etched surface', 'Anti-slip base', '450 × 400mm'],
    attrs: { size: ['large'], surfaceType: ['glass'], thickness: '4mm', stitchedEdges: false } },
  { name: 'Glorious Padded XXL Extended', category: 'mousepads', brand: 'Glorious', price: 29.99, rating: 4.6,
    description: 'Huge stitched cloth mat that covers keyboard and mouse with a smooth, fast surface.',
    features: ['914 × 457mm', 'Stitched edges', 'Anti-fray', 'Non-slip base'],
    attrs: { size: ['extended', 'desk-mat'], surfaceType: ['cloth-speed'], thickness: '3mm', stitchedEdges: true } },

  // ───────────── Speakers (+5) ─────────────
  { name: 'Razer Leviathan V2', category: 'speakers', brand: 'Razer', price: 249.99, rating: 4.4,
    description: 'Under-monitor PC soundbar with a down-firing subwoofer, THX Spatial Audio and Chroma RGB.',
    features: ['Soundbar + subwoofer', 'THX Spatial Audio', 'Bluetooth 5.2', 'Chroma RGB'], compatibility: ['pc', 'mobile'],
    attrs: { configuration: ['soundbar'], connection: ['usb', 'bluetooth'], rgbLighting: true, features: ['eq', 'bass-boost'] } },
  { name: 'Creative Sound Blaster Katana V2', category: 'speakers', brand: 'Creative', price: 299.99, rating: 4.5,
    description: 'Multi-channel soundbar with Super X-Fi, a separate subwoofer and a built-in sound card.',
    features: ['5-driver soundbar + sub', 'Super X-Fi', 'Optical, USB, Bluetooth, AUX', 'Remote included', 'RGB'], compatibility: ['pc', 'ps5', 'xbox-series', 'switch'],
    attrs: { configuration: ['soundbar', '2.1'], connection: ['usb', 'optical', 'bluetooth', '3.5mm'], rgbLighting: true, features: ['remote', 'eq', 'bass-boost'] } },
  { name: 'Audioengine A2+ Wireless', category: 'speakers', brand: 'Audioengine', price: 269.0, rating: 4.7,
    description: 'Compact powered desktop speakers with a built-in DAC and Bluetooth, punching far above their size.',
    features: ['Built-in 24-bit DAC', 'Bluetooth aptX', 'USB, RCA and 3.5mm', 'Subwoofer output'], compatibility: ['pc', 'mobile'],
    attrs: { configuration: ['2.0'], connection: ['usb', 'bluetooth', 'rca', '3.5mm'], rgbLighting: false, powerOutput: '60W peak', features: ['volume-knob'] } },
  { name: 'Edifier R1280DB', category: 'speakers', brand: 'Edifier', price: 129.99, rating: 4.6,
    description: 'Wood-finish bookshelf speakers with Bluetooth, optical and coaxial inputs, and side-panel tone controls.',
    features: ['42W RMS', 'Bluetooth, optical, coaxial, RCA', 'Bass and treble dials', 'Remote control'], compatibility: ['pc', 'ps5', 'mobile'],
    attrs: { configuration: ['2.0'], connection: ['bluetooth', 'optical', 'rca'], rgbLighting: false, powerOutput: '42W RMS', features: ['remote', 'eq', 'volume-knob'] } },
  { name: 'Klipsch ProMedia 2.1 THX', category: 'speakers', brand: 'Klipsch', price: 149.99, rating: 4.6,
    description: 'THX-certified 2.1 system with a 6.5" subwoofer that has been a desktop favourite for two decades.',
    features: ['THX certified', '6.5" subwoofer', 'Desktop control pod', 'Headphone jack'], compatibility: PC,
    attrs: { configuration: ['2.1'], connection: ['3.5mm'], rgbLighting: false, powerOutput: '200W peak', features: ['volume-knob', 'bass-boost'] } },
];

// ───────────────────────── helpers ─────────────────────────
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/\+/g, ' plus ')
    .replace(/["'’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const KNOWN_CATEGORIES = ['keyboards', 'mice', 'headsets', 'monitors', 'controllers', 'chairs', 'mousepads', 'microphones', 'speakers', 'accessories', 'webcams', 'vr-headsets'];

function validate(): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const p of products) {
    const slug = slugify(p.name);
    if (seen.has(slug)) errors.push(`duplicate slug ${slug}`);
    seen.add(slug);
    if (!KNOWN_CATEGORIES.includes(p.category)) errors.push(`${p.name}: unknown category ${p.category}`);
    if (!(p.price > 0)) errors.push(`${p.name}: bad price`);
    if (p.originalPrice !== undefined && p.originalPrice <= p.price) errors.push(`${p.name}: originalPrice not above price`);
    if (p.rating < 0 || p.rating > 5) errors.push(`${p.name}: rating out of range`);
    if (!p.description || p.features.length === 0) errors.push(`${p.name}: missing description/features`);
  }
  return errors;
}

async function main() {
  const args = process.argv.slice(2);
  const errors = validate();
  if (errors.length) {
    console.error('❌ Data problems:\n - ' + errors.join('\n - '));
    process.exit(1);
  }
  if (args.includes('--validate')) {
    const counts: Record<string, number> = {};
    products.forEach((p) => (counts[p.category] = (counts[p.category] || 0) + 1));
    console.log(`✅ ${products.length} products valid`, counts);
    return;
  }
  const dry = args.includes('--dry');

  if (!process.env.SANITY_API_TOKEN && !dry) {
    console.error('❌ SANITY_API_TOKEN missing in .env.local');
    process.exit(1);
  }
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: '2025-08-29',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
  });

  const [categories, brands, existing] = await Promise.all([
    client.fetch<{ _id: string; slug: string }[]>(`*[_type=="category" && !(_id in path("drafts.**"))]{_id,"slug":slug.current}`),
    client.fetch<{ _id: string; name: string }[]>(`*[_type=="brand" && !(_id in path("drafts.**"))]{_id,name}`),
    client.fetch<string[]>(`*[_type=="product"].slug.current`),
  ]);
  const catBySlug = new Map(categories.map((c) => [c.slug, c._id]));
  const brandByName = new Map(brands.map((b) => [b.name.toLowerCase(), b._id]));
  const existingSlugs = new Set(existing);

  let created = 0, skipped = 0, newBrands = 0;
  for (const p of products) {
    const slug = slugify(p.name);
    if (existingSlugs.has(slug)) { skipped++; console.log(`↷ skip (exists) ${p.name}`); continue; }

    const categoryId = catBySlug.get(p.category);
    if (!categoryId) { console.warn(`⚠️  category "${p.category}" not found, skipping ${p.name}`); skipped++; continue; }

    let brandId = brandByName.get(p.brand.toLowerCase());
    if (!brandId) {
      brandId = `brand-${slugify(p.brand)}`;
      if (!dry) {
        await client.createIfNotExists({ _id: brandId, _type: 'brand', name: p.brand, slug: { _type: 'slug', current: slugify(p.brand) } });
      }
      brandByName.set(p.brand.toLowerCase(), brandId);
      newBrands++;
      console.log(`＋ brand ${p.brand}`);
    }

    const doc = {
      _id: `product-${slug}`,
      _type: 'product',
      name: p.name,
      slug: { _type: 'slug', current: slug },
      description: p.description,
      price: p.price,
      ...(p.originalPrice ? { originalPrice: p.originalPrice } : {}),
      category: { _type: 'reference', _ref: categoryId },
      brand: { _type: 'reference', _ref: brandId },
      features: p.features,
      ...(p.compatibility ? { compatibility: p.compatibility } : {}),
      ...(p.attrs ? { categoryAttributes: p.attrs } : {}),
      inStock: p.inStock ?? true,
      isFeatured: p.isFeatured ?? false,
      isNew: p.isNew ?? false,
      rating: p.rating,
    };

    if (dry) console.log(`• would create ${p.name} ($${p.price}) → ${p.category}`);
    else { await client.createIfNotExists(doc); console.log(`✓ ${p.name}`); }
    created++;
  }
  console.log(`\n${dry ? 'Dry run: ' : ''}${created} created, ${skipped} skipped, ${newBrands} new brand(s).`);
}

main().catch((e) => { console.error(e); process.exit(1); });
