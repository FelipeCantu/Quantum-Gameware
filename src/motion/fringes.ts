// About hero signature (DESIGN.md, "Two slits"). One variable, p: 0 is superposition, 1 is observed.
// Two ring sets, cobalt and gill, ripple in from sources off the right edge; where they overlap
// they form interference fringes. p comes from scroll through the sticky stage; the pointer shifts
// the waves' phase so the fringes slide; the rings travel outward on the GSAP ticker (the idle state).
// As p rises every fringe but the central one fades: the line where both waves agree, which the
// DOM rule [data-fringe-line] draws in under the headline.
//   [data-fringes]        the section (scroll span, pointer area, is-observed flag)
//   [data-fringe-field]   empty box the canvas is mounted into
//   [data-fringe-line]    the agreement line (a DOM rule; the field is centred on it)
//   [data-fringe-count]   readout: fringes still visible
//   [data-observe-state]  readout: status label
// Reduced motion or no WebGL: no canvas, and the server-rendered observed state stays.
import { gsap } from 'gsap';
import { isMobile, isTouch, onPage, prefersReducedMotion } from '@/engine';

const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;

const FRAG = `precision highp float;
uniform vec2 uRes;
uniform float uDpr, uTime, uP, uLineY, uSrcX, uSep, uPhi, uLambda;
uniform vec3 uQ, uG, uInk;
const float PI = 3.14159265;
const float TAU = 6.2831853;
// A thin crest line wherever the wave's phase passes 0, about two CSS pixels wide.
float crest(float th, float k) {
  float d = abs(mod(th + PI, TAU) - PI);
  return 1.0 - smoothstep(0.7 * k, 1.9 * k, d);
}
void main() {
  vec2 pos = vec2(gl_FragCoord.x, uRes.y * uDpr - gl_FragCoord.y) / uDpr;
  vec2 s1 = vec2(uSrcX, uLineY - uSep);
  vec2 s2 = vec2(uSrcX, uLineY + uSep);
  float r1 = distance(pos, s1);
  float r2 = distance(pos, s2);
  float k = TAU / uLambda;
  float w = uTime * 1.6;
  float c1 = crest(k * r1 - w, k);
  float c2 = crest(k * r2 - w + uPhi, k);
  // Interference order: 0 on the line where both waves agree.
  float m = (k * (r1 - r2) + uPhi) / TAU;
  float keep = mix(1.0, exp(-m * m * 3.5), uP);
  // Strong near the sources, faint under the copy on the left, and quiet below the line where the
  // lede and readout sit, so body text never reads through dense rings.
  float x = pos.x / uRes.x;
  float below = smoothstep(uLineY + 8.0, uLineY + 48.0, pos.y);
  float amp = mix(0.16, 0.62, smoothstep(0.05, 1.0, x)) * mix(1.0, 0.18, below) * keep;
  float a1 = c1 * amp;
  float a2 = c2 * amp;
  // Premultiplied: cobalt and gill alone, ink where the two crests cross.
  vec3 col = uQ * a1 * (1.0 - a2) + uG * a2 * (1.0 - a1) + uInk * a1 * a2;
  gl_FragColor = vec4(col, a1 + a2 - a1 * a2);
}`;

const clamp = (v: number) => Math.min(1, Math.max(0, v));

function rgb(css: string) {
  const c = document.createElement('canvas').getContext('2d')!;
  c.fillStyle = css;
  const hex = c.fillStyle as string; // normalised to #rrggbb
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
}

function compile(gl: WebGLRenderingContext) {
  const shader = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const vs = shader(gl.VERTEX_SHADER, VERT);
  const fs = shader(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  return gl.getProgramParameter(prog, gl.LINK_STATUS) ? prog : null;
}

export function startFringes() {
  onPage(() => {
    const root = document.querySelector<HTMLElement>('[data-fringes]');
    const field = root?.querySelector<HTMLElement>('[data-fringe-field]');
    const line = root?.querySelector<HTMLElement>('[data-fringe-line]');
    if (!root || !field || !line || prefersReducedMotion()) return;

    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    const gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: true });
    const prog = gl && compile(gl);
    if (!gl || !prog) return; // the observed state stays
    field.appendChild(canvas);

    const count = root.querySelector<HTMLElement>('[data-fringe-count]');
    const status = root.querySelector<HTMLElement>('[data-observe-state]');

    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (name: string) => gl.getUniformLocation(prog, name);
    const U = {
      res: u('uRes'), dpr: u('uDpr'), time: u('uTime'), p: u('uP'), lineY: u('uLineY'), srcX: u('uSrcX'),
      sep: u('uSep'), phi: u('uPhi'), lambda: u('uLambda'), q: u('uQ'), g: u('uG'), ink: u('uInk'),
    };
    // Colours come from the tokens, so dark mode gets its own cobalt and ink.
    const styles = getComputedStyle(document.documentElement);
    gl.uniform3fv(U.q, rgb(styles.getPropertyValue('--c-accent').trim()));
    gl.uniform3fv(U.g, rgb(styles.getPropertyValue('--c-gill').trim()));
    gl.uniform3fv(U.ink, rgb(styles.getPropertyValue('--c-fg').trim()));

    // Geometry in CSS pixels, measured from the field box. Phones get a lower resolution and draw
    // every other frame (the rings drift slowly, so 30 fps reads the same and frees the main thread).
    const phone = isMobile();
    const dpr = Math.min(devicePixelRatio || 1, phone ? 1 : 1.25);
    let frame = 0;
    const geo = { w: 1, h: 1, lineY: 0, sep: 120, lambda: 24, fringes: 1 };
    const measure = () => {
      const f = field.getBoundingClientRect();
      const l = line.getBoundingClientRect();
      geo.w = Math.max(1, f.width);
      geo.h = Math.max(1, f.height);
      geo.lineY = l.top - f.top;
      geo.sep = Math.min(geo.h * 0.16, 150);
      geo.lambda = geo.w < 768 ? 18 : 24;
      // Orders on screen: |r1 - r2| never exceeds the source spacing.
      geo.fringes = 2 * Math.floor((2 * geo.sep) / geo.lambda) + 1;
      canvas.width = Math.round(geo.w * dpr);
      canvas.height = Math.round(geo.h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(U.res, geo.w, geo.h);
      gl.uniform1f(U.dpr, dpr);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(field);
    document.fonts?.ready.then(measure);

    const pointer = { x: 0, y: 0 };
    const lag = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      pointer.x = (e.clientX - r.left) / r.width - 0.5;
      pointer.y = (e.clientY - r.top) / Math.min(r.height, innerHeight) - 0.5;
    };
    const onLeave = () => { pointer.x = 0; pointer.y = 0; };
    if (!isTouch()) {
      root.addEventListener('pointermove', onMove);
      root.addEventListener('pointerleave', onLeave);
    }

    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(root);

    gsap.set(line, { scaleX: 0, transformOrigin: '100% 50%' });
    let p = 0;
    let observed = true; // the server renders the observed state; the first frame flips it
    let shown = -1;
    const tick = (time: number) => {
      if (!visible || document.hidden) return;
      const rect = root.getBoundingClientRect();
      const span = Math.max(1, rect.height - innerHeight);
      const target = clamp(-rect.top / (span * 0.8));
      p += (target - p) * 0.1;
      if (Math.abs(target - p) < 0.0005) p = target;
      lag.x += (pointer.x - lag.x) * 0.06;
      lag.y += (pointer.y - lag.y) * 0.06;
      const eased = p * p * (3 - 2 * p);
      const u = 1 - eased;

      if (!phone || (frame++ & 1) === 0) {
        gl.uniform1f(U.time, time);
        gl.uniform1f(U.p, eased);
        gl.uniform1f(U.lineY, geo.lineY);
        gl.uniform1f(U.srcX, geo.w * 1.08);
        gl.uniform1f(U.sep, geo.sep * (1 + lag.y * 0.35 * u));
        gl.uniform1f(U.phi, lag.x * 5 * u);
        gl.uniform1f(U.lambda, geo.lambda);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }

      gsap.set(line, { scaleX: Math.max(0.0001, clamp((eased - 0.35) / 0.6)) });
      // The readout reaches 1 only when the state reads Observed, so the two never disagree.
      const nowObserved = p > 0.965;
      const n = nowObserved ? 1 : Math.max(3, Math.round(geo.fringes * Math.pow(u, 1.5)) | 1);
      if (count && n !== shown) { shown = n; count.textContent = String(n); }
      if (nowObserved !== observed) {
        observed = nowObserved;
        root.classList.toggle('is-observed', observed);
        if (status) status.textContent = observed ? 'Observed' : 'Superposition';
      }
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      ro.disconnect();
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.remove();
    };
  });
}
