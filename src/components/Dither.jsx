import { useEffect, useRef } from "react";

const vertexShaderSource = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = (position + 1.0) * 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision highp float;
varying vec2 vUv;

uniform vec2 resolution;
uniform float time;
uniform float waveSpeed;
uniform float waveFrequency;
uniform float waveAmplitude;
uniform vec3 waveColor;
uniform vec2 mousePos;
uniform int enableMouseInteraction;
uniform float mouseRadius;
uniform float colorNum;
uniform float pixelSize;

vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
  g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 1.0;
  float freq = waveFrequency;
  for (int i = 0; i < 4; i++) {
    value += amp * abs(cnoise(p));
    p *= freq;
    amp *= waveAmplitude;
  }
  return value;
}

float pattern(vec2 p) {
  vec2 p2 = p - time * waveSpeed;
  return fbm(p + fbm(p2)); 
}

const float bayerMatrix8x8[64] = float[64](
  0.0/64.0, 48.0/64.0, 12.0/64.0, 60.0/64.0,  3.0/64.0, 51.0/64.0, 15.0/64.0, 63.0/64.0,
  32.0/64.0,16.0/64.0, 44.0/64.0, 28.0/64.0, 35.0/64.0,19.0/64.0, 47.0/64.0, 31.0/64.0,
  8.0/64.0, 56.0/64.0,  4.0/64.0, 52.0/64.0, 11.0/64.0,59.0/64.0,  7.0/64.0, 55.0/64.0,
  40.0/64.0,24.0/64.0, 36.0/64.0, 20.0/64.0, 43.0/64.0,27.0/64.0, 39.0/64.0, 23.0/64.0,
  2.0/64.0, 50.0/64.0, 14.0/64.0, 62.0/64.0,  1.0/64.0,49.0/64.0, 13.0/64.0, 61.0/64.0,
  34.0/64.0,18.0/64.0, 46.0/64.0, 30.0/64.0, 33.0/64.0,17.0/64.0, 45.0/64.0, 29.0/64.0,
  10.0/64.0,58.0/64.0,  6.0/64.0, 54.0/64.0,  9.0/64.0,57.0/64.0,  5.0/64.0, 53.0/64.0,
  42.0/64.0,26.0/64.0, 38.0/64.0, 22.0/64.0, 41.0/64.0,25.0/64.0, 37.0/64.0, 21.0/64.0
);

vec3 applyDither(vec2 screenCoord, vec3 color) {
  vec2 scaledCoord = floor(screenCoord / pixelSize);
  int x = int(mod(scaledCoord.x, 8.0));
  int y = int(mod(scaledCoord.y, 8.0));
  int index = y * 8 + x;
  
  float threshold = 0.0;
  for (int i = 0; i < 64; i++) {
    if (i == index) {
      threshold = bayerMatrix8x8[i] - 0.25;
      break;
    }
  }
  
  float stepVal = 1.0 / max(colorNum - 1.0, 1.0);
  color += threshold * stepVal;
  float bias = 0.2;
  color = clamp(color - bias, 0.0, 1.0);
  return floor(color * (colorNum - 1.0) + 0.5) / max(colorNum - 1.0, 1.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  uv -= 0.5;
  uv.x *= resolution.x / resolution.y;
  
  float f = pattern(uv);
  if (enableMouseInteraction == 1) {
    vec2 mouseNDC = (mousePos / resolution - 0.5) * vec2(1.0, -1.0);
    mouseNDC.x *= resolution.x / resolution.y;
    float dist = length(uv - mouseNDC);
    float effect = 1.0 - smoothstep(0.0, mouseRadius, dist);
    f -= 0.5 * effect;
  }
  
  vec3 col = mix(vec3(0.01, 0.02, 0.05), waveColor, clamp(f, 0.0, 1.0));
  vec3 dithered = applyDither(gl_FragCoord.xy, col);
  gl_FragColor = vec4(dithered, 1.0);
}
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function Dither({
  waveSpeed = 0.05,
  waveFrequency = 3,
  waveAmplitude = 0.35,
  waveColor = [0.15, 0.55, 0.85],
  colorNum = 4,
  pixelSize = 2.5,
  enableMouseInteraction = true,
  mouseRadius = 1.2,
  className = "",
}) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      powerPreference: "high-performance",
      antialias: false,
      depth: false,
      alpha: false,
    });

    if (!gl) return;

    const vertShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Full screen quad
    const quad = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uResolution = gl.getUniformLocation(program, "resolution");
    const uTime = gl.getUniformLocation(program, "time");
    const uWaveSpeed = gl.getUniformLocation(program, "waveSpeed");
    const uWaveFrequency = gl.getUniformLocation(program, "waveFrequency");
    const uWaveAmplitude = gl.getUniformLocation(program, "waveAmplitude");
    const uWaveColor = gl.getUniformLocation(program, "waveColor");
    const uMousePos = gl.getUniformLocation(program, "mousePos");
    const uEnableMouse = gl.getUniformLocation(program, "enableMouseInteraction");
    const uMouseRadius = gl.getUniformLocation(program, "mouseRadius");
    const uColorNum = gl.getUniformLocation(program, "colorNum");
    const uPixelSize = gl.getUniformLocation(program, "pixelSize");

    gl.uniform1f(uWaveSpeed, waveSpeed);
    gl.uniform1f(uWaveFrequency, waveFrequency);
    gl.uniform1f(uWaveAmplitude, waveAmplitude);
    gl.uniform3fv(uWaveColor, waveColor);
    gl.uniform1i(uEnableMouse, enableMouseInteraction ? 1 : 0);
    gl.uniform1f(uMouseRadius, mouseRadius);
    gl.uniform1f(uColorNum, colorNum);
    gl.uniform1f(uPixelSize, pixelSize);

    let animationFrameId;
    let startTime = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.floor(canvas.clientWidth * dpr);
      const height = Math.floor(canvas.clientHeight * dpr);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
        gl.uniform2f(uResolution, width, height);
      }
    };

    const handlePointerMove = (e) => {
      if (!enableMouseInteraction) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      mouseRef.current.targetX = (e.clientX - rect.left) * dpr;
      mouseRef.current.targetY = (e.clientY - rect.top) * dpr;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    resize();

    const handleVisibility = () => {
      isVisibleRef.current = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const render = (now) => {
      if (isVisibleRef.current) {
        // Smooth mouse lerp
        const m = mouseRef.current;
        m.x += (m.targetX - m.x) * 0.1;
        m.y += (m.targetY - m.y) * 0.1;

        const elapsed = (now - startTime) * 0.001;
        gl.uniform1f(uTime, elapsed);
        gl.uniform2f(uMousePos, m.x, m.y);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
      gl.deleteBuffer(buffer);
    };
  }, [
    waveSpeed,
    waveFrequency,
    waveAmplitude,
    waveColor,
    colorNum,
    pixelSize,
    enableMouseInteraction,
    mouseRadius,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full block ${className}`}
      style={{ imageRendering: "pixelated" }}
    />
  );
}
