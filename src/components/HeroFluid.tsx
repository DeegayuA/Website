"use client";

/**
 * Noth.in-style hero ink — a GPU fluid simulation revealed only through the
 * glyphs of the hero heading. The DOM h1 keeps painting its gradient text
 * underneath (SSR-visible, untouched); this canvas draws dye where the
 * pointer has stirred it, masked by the same glyph shapes rasterised from
 * the live DOM (font, size, tracking and language all inherited).
 *
 * The solver is a trimmed Navier–Stokes sim after Pavel Dobryakov's
 * MIT-licensed WebGL-Fluid-Simulation. WebGL2 only — browsers without it,
 * failed shader compiles, or prefers-reduced-motion simply never see the
 * canvas and the heading renders exactly as before.
 */

import { useEffect, useRef, type RefObject } from "react";
import { useReducedMotion } from "motion/react";
import { useQuality } from "@/lib/quality";

const SIM_RES = 96;
const DYE_RES = 384;
const PRESSURE_ITERS = 16;
const DENSITY_DISSIPATION = 0.75; // dye fade per second
const VELOCITY_DISSIPATION = 0.7;
const CURL = 14;
const SPLAT_RADIUS = 0.32;
const SPLAT_FORCE = 4500;
const AMBIENT_EVERY_MS = 4200;
const MAX_DPR = 2;
const POINTER_MARGIN = 80; // px beyond the heading that still stirs the ink

/* CTA-pill hues — the site's single accent moment, echoed in the ink */
const PALETTE: Array<[number, number, number]> = [
  [0.71, 0.0, 0.66], // #B600A8 magenta
  [0.46, 0.13, 0.69], // #7621B0 violet
  [0.75, 0.3, 0.0], // #BE4C00 ember
  [0.85, 0.04, 0.32], // deep rose
];

/* ── Shaders ─────────────────────────────────────────────────── */

const VERT = `
  precision highp float;
  attribute vec2 aPosition;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform vec2 texelSize;
  void main () {
    vUv = aPosition * 0.5 + 0.5;
    vL = vUv - vec2(texelSize.x, 0.0);
    vR = vUv + vec2(texelSize.x, 0.0);
    vT = vUv + vec2(0.0, texelSize.y);
    vB = vUv - vec2(0.0, texelSize.y);
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const FRAG_CLEAR = `
  precision mediump float;
  varying highp vec2 vUv;
  uniform sampler2D uTexture;
  uniform float value;
  void main () {
    gl_FragColor = value * texture2D(uTexture, vUv);
  }
`;

const FRAG_SPLAT = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTarget;
  uniform float aspectRatio;
  uniform vec3 color;
  uniform vec2 point;
  uniform float radius;
  void main () {
    vec2 p = vUv - point.xy;
    p.x *= aspectRatio;
    vec3 splat = exp(-dot(p, p) / radius) * color;
    vec3 base = texture2D(uTarget, vUv).xyz;
    gl_FragColor = vec4(base + splat, 1.0);
  }
`;

const FRAG_ADVECTION = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 texelSize;
  uniform float dt;
  uniform float dissipation;
  void main () {
    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
    vec4 result = texture2D(uSource, coord);
    float decay = 1.0 + dissipation * dt;
    gl_FragColor = result / decay;
  }
`;

const FRAG_DIVERGENCE = `
  precision mediump float;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uVelocity, vL).x;
    float R = texture2D(uVelocity, vR).x;
    float T = texture2D(uVelocity, vT).y;
    float B = texture2D(uVelocity, vB).y;
    vec2 C = texture2D(uVelocity, vUv).xy;
    if (vL.x < 0.0) { L = -C.x; }
    if (vR.x > 1.0) { R = -C.x; }
    if (vT.y > 1.0) { T = -C.y; }
    if (vB.y < 0.0) { B = -C.y; }
    float div = 0.5 * (R - L + T - B);
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
  }
`;

const FRAG_CURL = `
  precision mediump float;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uVelocity, vL).y;
    float R = texture2D(uVelocity, vR).y;
    float T = texture2D(uVelocity, vT).x;
    float B = texture2D(uVelocity, vB).x;
    float vorticity = R - L - T + B;
    gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
  }
`;

const FRAG_VORTICITY = `
  precision highp float;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform float curl;
  uniform float dt;
  void main () {
    float L = texture2D(uCurl, vL).x;
    float R = texture2D(uCurl, vR).x;
    float T = texture2D(uCurl, vT).x;
    float B = texture2D(uCurl, vB).x;
    float C = texture2D(uCurl, vUv).x;
    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    force /= length(force) + 0.0001;
    force *= curl * C;
    force.y *= -1.0;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity += force * dt;
    velocity = min(max(velocity, -1000.0), 1000.0);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

const FRAG_PRESSURE = `
  precision mediump float;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;
  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    float divergence = texture2D(uDivergence, vUv).x;
    float pressure = (L + R + B + T - divergence) * 0.25;
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`;

const FRAG_GRADIENT_SUBTRACT = `
  precision mediump float;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity.xy -= vec2(R - L, T - B);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

const FRAG_DISPLAY = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform sampler2D uMask;
  void main () {
    vec3 c = texture2D(uTexture, vUv).rgb;
    float d = max(c.r, max(c.g, c.b));
    float m = texture2D(uMask, vUv).a;
    float alpha = clamp(pow(d, 0.45) * 1.6, 0.0, 1.0) * m;
    vec3 hue = c / max(d, 0.001);
    vec3 col = hue * (0.72 + 0.28 * clamp(d, 0.0, 1.0));
    gl_FragColor = vec4(col, alpha);
  }
`;

/* ── GL plumbing ─────────────────────────────────────────────── */

interface FBO {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  attach(id: number): number;
}

interface DoubleFBO {
  read: FBO;
  write: FBO;
  swap(): void;
}

interface ProgramInfo {
  program: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation | null>;
}

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("shader alloc failed");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) ?? "shader compile failed");
  }
  return shader;
}

function createProgram(
  gl: WebGL2RenderingContext,
  vert: WebGLShader,
  fragSource: string,
): ProgramInfo {
  const frag = compileShader(gl, gl.FRAGMENT_SHADER, fragSource);
  const program = gl.createProgram();
  if (!program) throw new Error("program alloc failed");
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.bindAttribLocation(program, 0, "aPosition");
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) ?? "program link failed");
  }
  const uniforms: ProgramInfo["uniforms"] = {};
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(program, i);
    if (info) uniforms[info.name] = gl.getUniformLocation(program, info.name);
  }
  return { program, uniforms };
}

function createFBO(gl: WebGL2RenderingContext, w: number, h: number): FBO {
  const texture = gl.createTexture();
  if (!texture) throw new Error("texture alloc failed");
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);

  const fbo = gl.createFramebuffer();
  if (!fbo) throw new Error("framebuffer alloc failed");
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  gl.viewport(0, 0, w, h);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  return {
    texture,
    fbo,
    width: w,
    height: h,
    texelSizeX: 1 / w,
    texelSizeY: 1 / h,
    attach(id: number) {
      gl.activeTexture(gl.TEXTURE0 + id);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      return id;
    },
  };
}

function createDoubleFBO(gl: WebGL2RenderingContext, w: number, h: number): DoubleFBO {
  let fbo1 = createFBO(gl, w, h);
  let fbo2 = createFBO(gl, w, h);
  return {
    get read() {
      return fbo1;
    },
    get write() {
      return fbo2;
    },
    swap() {
      const t = fbo1;
      fbo1 = fbo2;
      fbo2 = t;
    },
  };
}

function getResolution(gl: WebGL2RenderingContext, base: number) {
  let aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
  if (aspect < 1) aspect = 1 / aspect;
  const min = Math.round(base);
  const max = Math.round(base * aspect);
  return gl.drawingBufferWidth > gl.drawingBufferHeight
    ? { width: max, height: min }
    : { width: min, height: max };
}

/* ── Component ───────────────────────────────────────────────── */

export function HeroFluid({
  headingRef,
  lang,
}: {
  headingRef: RefObject<HTMLHeadingElement | null>;
  lang: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rebuildMaskRef = useRef<(() => void) | null>(null);
  /* Mirrors the IntersectionObserver below so the language-swap effect can
     skip the (expensive) mask re-rasterisation while the hero is offscreen. */
  const visibleRef = useRef(true);
  const reduced = useReducedMotion();
  /* Quality-tier gate: "low" (weak/mobile hardware) never starts the sim;
     "medium" runs it at reduced resolution. The provider starts every load
     at "low" and upgrades after mount, so the sim only ever enhances in. */
  const tier = useQuality();
  const off = reduced || tier === "low";
  const resScale = tier === "high" ? 1 : 0.7;

  /* Re-rasterise the glyph mask when the heading swaps language —
     once immediately (old glyphs) and once after the swap settles. */
  useEffect(() => {
    // Offscreen: skip — the IO handler rebuilds once the hero re-enters
    if (!visibleRef.current) return;
    rebuildMaskRef.current?.();
    const t = setTimeout(() => rebuildMaskRef.current?.(), 850);
    return () => clearTimeout(t);
  }, [lang]);

  useEffect(() => {
    if (off) return;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    let gl: WebGL2RenderingContext | null = null;
    try {
      gl = canvas.getContext("webgl2", {
        alpha: true,
        premultipliedAlpha: false,
        depth: false,
        stencil: false,
        antialias: false,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }
    if (!gl || !gl.getExtension("EXT_color_buffer_float")) return;
    const ctx = gl;

    let raf = 0;
    let disposed = false;
    let visible = true;
    let maskReady = false;

    try {
      /* Programs */
      const vert = compileShader(ctx, ctx.VERTEX_SHADER, VERT);
      const clearProg = createProgram(ctx, vert, FRAG_CLEAR);
      const splatProg = createProgram(ctx, vert, FRAG_SPLAT);
      const advectionProg = createProgram(ctx, vert, FRAG_ADVECTION);
      const divergenceProg = createProgram(ctx, vert, FRAG_DIVERGENCE);
      const curlProg = createProgram(ctx, vert, FRAG_CURL);
      const vorticityProg = createProgram(ctx, vert, FRAG_VORTICITY);
      const pressureProg = createProgram(ctx, vert, FRAG_PRESSURE);
      const gradSubProg = createProgram(ctx, vert, FRAG_GRADIENT_SUBTRACT);
      const displayProg = createProgram(ctx, vert, FRAG_DISPLAY);

      /* Fullscreen quad */
      const buffer = ctx.createBuffer();
      ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer);
      ctx.bufferData(
        ctx.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        ctx.STATIC_DRAW,
      );
      ctx.enableVertexAttribArray(0);
      ctx.vertexAttribPointer(0, 2, ctx.FLOAT, false, 0, 0);

      const blit = (target: FBO | null) => {
        if (target) {
          ctx.viewport(0, 0, target.width, target.height);
          ctx.bindFramebuffer(ctx.FRAMEBUFFER, target.fbo);
        } else {
          ctx.viewport(0, 0, ctx.drawingBufferWidth, ctx.drawingBufferHeight);
          ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);
        }
        ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, 4);
      };

      /* Sim state */
      let dye: DoubleFBO;
      let velocity: DoubleFBO;
      let divergence: FBO;
      let curl: FBO;
      let pressure: DoubleFBO;
      const maskTexture = ctx.createTexture();
      if (!maskTexture) throw new Error("mask texture alloc failed");
      const maskCanvas = document.createElement("canvas");

      const initFramebuffers = () => {
        const simRes = getResolution(ctx, SIM_RES * resScale);
        const dyeRes = getResolution(ctx, DYE_RES * resScale);
        dye = createDoubleFBO(ctx, dyeRes.width, dyeRes.height);
        velocity = createDoubleFBO(ctx, simRes.width, simRes.height);
        divergence = createFBO(ctx, simRes.width, simRes.height);
        curl = createFBO(ctx, simRes.width, simRes.height);
        pressure = createDoubleFBO(ctx, simRes.width, simRes.height);
      };

      /* Rasterise the live heading glyphs into the mask texture */
      const rebuildMask = () => {
        const heading = headingRef.current;
        if (!heading || canvas.width === 0) return;
        const dpr = canvas.width / Math.max(canvas.clientWidth, 1);
        maskCanvas.width = canvas.width;
        maskCanvas.height = canvas.height;
        const mc = maskCanvas.getContext("2d");
        if (!mc) return;
        mc.setTransform(dpr, 0, 0, dpr, 0, 0);
        mc.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        mc.fillStyle = "#fff";
        mc.textAlign = "center";

        const wrapRect = wrap.getBoundingClientRect();
        const rows = heading.querySelectorAll<HTMLElement>("[data-fluid-text]");
        let drew = false;
        rows.forEach((row) => {
          const text = row.textContent?.trim();
          if (!text) return;
          const cs = getComputedStyle(row);
          if (parseFloat(cs.opacity) < 0.5) return; // mid-transition ghost
          mc.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
          if ("letterSpacing" in mc && cs.letterSpacing !== "normal") {
            (mc as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
              cs.letterSpacing;
          }
          const rect = row.getBoundingClientRect();
          const cx = rect.left - wrapRect.left + rect.width / 2;
          /* Place the alphabetic baseline where the browser puts it: half-leading
             above/below the font box, baseline at font-ascent from the box top. */
          const metrics = mc.measureText(text);
          const asc = metrics.fontBoundingBoxAscent ?? metrics.actualBoundingBoxAscent;
          const desc = metrics.fontBoundingBoxDescent ?? metrics.actualBoundingBoxDescent;
          const y =
            rect.top - wrapRect.top + (rect.height - (asc + desc)) / 2 + asc;
          mc.fillText(text, cx, y);
          drew = true;
        });
        if (!drew) return;

        ctx.activeTexture(ctx.TEXTURE0);
        ctx.bindTexture(ctx.TEXTURE_2D, maskTexture);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
        ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, true);
        ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, maskCanvas);
        ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, false);
        maskReady = true;
      };
      rebuildMaskRef.current = rebuildMask;

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
        const w = Math.max(1, Math.round(wrap.clientWidth * dpr));
        const h = Math.max(1, Math.round(wrap.clientHeight * dpr));
        if (canvas.width === w && canvas.height === h) return;
        canvas.width = w;
        canvas.height = h;
        initFramebuffers();
        rebuildMask();
      };
      resize();

      /* Splats */
      const correctRadius = (radius: number) => {
        const aspect = canvas.width / canvas.height;
        return aspect > 1 ? radius * aspect : radius;
      };

      const splat = (
        x: number,
        y: number,
        dx: number,
        dy: number,
        color: [number, number, number],
        radiusScale = 1,
      ) => {
        ctx.useProgram(splatProg.program);
        ctx.uniform1i(splatProg.uniforms.uTarget, velocity.read.attach(0));
        ctx.uniform1f(splatProg.uniforms.aspectRatio, canvas.width / canvas.height);
        ctx.uniform2f(splatProg.uniforms.point, x, y);
        ctx.uniform3f(splatProg.uniforms.color, dx, dy, 0);
        ctx.uniform1f(
          splatProg.uniforms.radius,
          correctRadius((SPLAT_RADIUS * radiusScale) / 100),
        );
        ctx.uniform2f(
          splatProg.uniforms.texelSize,
          velocity.read.texelSizeX,
          velocity.read.texelSizeY,
        );
        blit(velocity.write);
        velocity.swap();

        ctx.uniform1i(splatProg.uniforms.uTarget, dye.read.attach(0));
        ctx.uniform3f(splatProg.uniforms.color, color[0] * 0.8, color[1] * 0.8, color[2] * 0.8);
        blit(dye.write);
        dye.swap();
      };

      const paletteAt = (t: number): [number, number, number] => {
        const base = PALETTE[Math.floor(t / 900) % PALETTE.length];
        const k = 0.7 + 0.3 * Math.abs(Math.sin(t / 1300));
        return [base[0] * k, base[1] * k, base[2] * k];
      };

      /* Pointer */
      let lastX = -1;
      let lastY = -1;
      const onPointerMove = (e: PointerEvent) => {
        if (disposed || !visible || !maskReady) return;
        const rect = canvas.getBoundingClientRect();
        if (
          e.clientX < rect.left - POINTER_MARGIN ||
          e.clientX > rect.right + POINTER_MARGIN ||
          e.clientY < rect.top - POINTER_MARGIN ||
          e.clientY > rect.bottom + POINTER_MARGIN
        ) {
          lastX = -1;
          return;
        }
        const x = (e.clientX - rect.left) / rect.width;
        const y = 1 - (e.clientY - rect.top) / rect.height;
        if (lastX >= 0) {
          const dx = (x - lastX) * SPLAT_FORCE;
          const dy = (y - lastY) * SPLAT_FORCE;
          if (Math.abs(dx) + Math.abs(dy) > 1) {
            splat(x, y, dx, dy, paletteAt(performance.now()));
          }
        }
        lastX = x;
        lastY = y;
      };
      const onPointerDown = (e: PointerEvent) => {
        if (disposed || !visible || !maskReady) return;
        const rect = canvas.getBoundingClientRect();
        if (
          e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom
        )
          return;
        const x = (e.clientX - rect.left) / rect.width;
        const y = 1 - (e.clientY - rect.top) / rect.height;
        const c = paletteAt(performance.now() + 1800);
        splat(x, y, (Math.random() - 0.5) * 600, (Math.random() - 0.5) * 600, c, 2.2);
      };
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerdown", onPointerDown, { passive: true });

      /* Ambient drips keep it alive without a pointer */
      const ambient = () => {
        if (disposed || !visible || !maskReady || document.hidden) return;
        const x = 0.15 + Math.random() * 0.7;
        const y = 0.25 + Math.random() * 0.55;
        const c = paletteAt(performance.now() + Math.random() * 4000);
        splat(x, y, (Math.random() - 0.5) * 250, -150 - Math.random() * 250, c, 0.8);
      };
      const ambientId = window.setInterval(ambient, AMBIENT_EVERY_MS);

      /* Intro burst so the effect is discoverable before any hover */
      const introId = window.setTimeout(() => {
        if (disposed || !maskReady) return;
        for (let i = 0; i < 4; i++) {
          const c = PALETTE[i % PALETTE.length];
          splat(
            0.2 + Math.random() * 0.6,
            0.3 + Math.random() * 0.4,
            (Math.random() - 0.5) * 1200,
            (Math.random() - 0.5) * 1200,
            c,
            1.4,
          );
        }
      }, 1300);

      /* Sim step */
      const step = (dt: number) => {
        ctx.disable(ctx.BLEND);

        ctx.useProgram(curlProg.program);
        ctx.uniform2f(
          curlProg.uniforms.texelSize,
          velocity.read.texelSizeX,
          velocity.read.texelSizeY,
        );
        ctx.uniform1i(curlProg.uniforms.uVelocity, velocity.read.attach(0));
        blit(curl);

        ctx.useProgram(vorticityProg.program);
        ctx.uniform2f(
          vorticityProg.uniforms.texelSize,
          velocity.read.texelSizeX,
          velocity.read.texelSizeY,
        );
        ctx.uniform1i(vorticityProg.uniforms.uVelocity, velocity.read.attach(0));
        ctx.uniform1i(vorticityProg.uniforms.uCurl, curl.attach(1));
        ctx.uniform1f(vorticityProg.uniforms.curl, CURL);
        ctx.uniform1f(vorticityProg.uniforms.dt, dt);
        blit(velocity.write);
        velocity.swap();

        ctx.useProgram(divergenceProg.program);
        ctx.uniform2f(
          divergenceProg.uniforms.texelSize,
          velocity.read.texelSizeX,
          velocity.read.texelSizeY,
        );
        ctx.uniform1i(divergenceProg.uniforms.uVelocity, velocity.read.attach(0));
        blit(divergence);

        ctx.useProgram(clearProg.program);
        ctx.uniform1i(clearProg.uniforms.uTexture, pressure.read.attach(0));
        ctx.uniform1f(clearProg.uniforms.value, 0.8);
        blit(pressure.write);
        pressure.swap();

        ctx.useProgram(pressureProg.program);
        ctx.uniform2f(
          pressureProg.uniforms.texelSize,
          velocity.read.texelSizeX,
          velocity.read.texelSizeY,
        );
        ctx.uniform1i(pressureProg.uniforms.uDivergence, divergence.attach(0));
        for (let i = 0; i < PRESSURE_ITERS; i++) {
          ctx.uniform1i(pressureProg.uniforms.uPressure, pressure.read.attach(1));
          blit(pressure.write);
          pressure.swap();
        }

        ctx.useProgram(gradSubProg.program);
        ctx.uniform2f(
          gradSubProg.uniforms.texelSize,
          velocity.read.texelSizeX,
          velocity.read.texelSizeY,
        );
        ctx.uniform1i(gradSubProg.uniforms.uPressure, pressure.read.attach(0));
        ctx.uniform1i(gradSubProg.uniforms.uVelocity, velocity.read.attach(1));
        blit(velocity.write);
        velocity.swap();

        ctx.useProgram(advectionProg.program);
        ctx.uniform2f(
          advectionProg.uniforms.texelSize,
          velocity.read.texelSizeX,
          velocity.read.texelSizeY,
        );
        const velId = velocity.read.attach(0);
        ctx.uniform1i(advectionProg.uniforms.uVelocity, velId);
        ctx.uniform1i(advectionProg.uniforms.uSource, velId);
        ctx.uniform1f(advectionProg.uniforms.dt, dt);
        ctx.uniform1f(advectionProg.uniforms.dissipation, VELOCITY_DISSIPATION);
        blit(velocity.write);
        velocity.swap();

        ctx.uniform1i(advectionProg.uniforms.uVelocity, velocity.read.attach(0));
        ctx.uniform1i(advectionProg.uniforms.uSource, dye.read.attach(1));
        ctx.uniform1f(advectionProg.uniforms.dissipation, DENSITY_DISSIPATION);
        blit(dye.write);
        dye.swap();
      };

      const render = () => {
        ctx.useProgram(displayProg.program);
        ctx.uniform2f(displayProg.uniforms.texelSize, 1 / canvas.width, 1 / canvas.height);
        ctx.uniform1i(displayProg.uniforms.uTexture, dye.read.attach(0));
        ctx.activeTexture(ctx.TEXTURE1);
        ctx.bindTexture(ctx.TEXTURE_2D, maskTexture);
        ctx.uniform1i(displayProg.uniforms.uMask, 1);
        blit(null);
      };

      let lastTime = performance.now();
      const loop = (now: number) => {
        if (disposed) return;
        const dt = Math.min((now - lastTime) / 1000, 1 / 30);
        lastTime = now;
        if (visible && maskReady && dt > 0) {
          step(dt);
          render();
        }
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);

      /* Observers */
      const io = new IntersectionObserver(([entry]) => {
        const was = visible;
        visible = entry.isIntersecting;
        visibleRef.current = visible;
        if (!visible) lastX = -1;
        // Re-entering: the mask may be stale from swaps skipped while hidden
        else if (!was) rebuildMask();
      });
      io.observe(wrap);

      let resizeTimer = 0;
      const ro = new ResizeObserver(() => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(resize, 150);
      });
      ro.observe(wrap);

      document.fonts?.ready.then(() => {
        if (!disposed) rebuildMask();
      });

      const onContextLost = (e: Event) => {
        e.preventDefault();
        disposed = true;
        cancelAnimationFrame(raf);
      };
      canvas.addEventListener("webglcontextlost", onContextLost);

      return () => {
        disposed = true;
        rebuildMaskRef.current = null;
        cancelAnimationFrame(raf);
        window.clearInterval(ambientId);
        window.clearTimeout(introId);
        window.clearTimeout(resizeTimer);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("webglcontextlost", onContextLost);
        io.disconnect();
        ro.disconnect();
        ctx.getExtension("WEBGL_lose_context")?.loseContext();
      };
    } catch {
      // Decorative layer only — any GL failure leaves the heading untouched.
      disposed = true;
      cancelAnimationFrame(raf);
      return;
    }
  }, [off, resScale, headingRef]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
    >
      {!off && <canvas ref={canvasRef} className="h-full w-full" />}
    </div>
  );
}
