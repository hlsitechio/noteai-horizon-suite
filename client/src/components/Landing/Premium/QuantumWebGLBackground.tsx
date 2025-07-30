import React, { useEffect, useRef, useCallback } from 'react';

interface QuantumWebGLBackgroundProps {
  mousePosition: { x: number; y: number };
  scrollProgress?: number;
}

const QuantumWebGLBackground: React.FC<QuantumWebGLBackgroundProps> = ({ 
  mousePosition, 
  scrollProgress = 0 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const scrollRef = useRef(0);

  // Advanced vertex shader with quantum field distortions
  const vertexShaderSource = `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  // Revolutionary fragment shader with quantum aurora effects
  const fragmentShaderSource = `
    precision highp float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;
    uniform float u_scroll;
    
    // Quantum field noise functions
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
    
    // Quantum field function
    float quantumField(vec3 p) {
      float field = 0.0;
      field += snoise(p * 0.5) * 0.8;
      field += snoise(p * 1.0) * 0.4;
      field += snoise(p * 2.0) * 0.2;
      field += snoise(p * 4.0) * 0.1;
      return field;
    }
    
    // Aurora wave function
    vec3 auroraWave(vec2 uv, float time) {
      vec2 p = uv * 2.0 - 1.0;
      float mouseInfluence = length(p - u_mouse) * 2.0;
      
      // Multi-layered aurora
      float wave1 = sin(p.x * 3.0 + time * 0.8 + mouseInfluence) * 0.5;
      float wave2 = sin(p.x * 5.0 - time * 1.2 + p.y * 2.0) * 0.3;
      float wave3 = sin(p.x * 7.0 + time * 0.6 + p.y * 4.0) * 0.2;
      
      float intensity = (wave1 + wave2 + wave3) * 0.5 + 0.5;
      intensity *= smoothstep(0.0, 0.3, abs(p.y - wave1 * 0.3));
      
      // Quantum aurora colors (our custom palette)
      vec3 color1 = vec3(0.4, 1.0, 0.8); // Quantum turquoise
      vec3 color2 = vec3(1.0, 0.9, 0.3); // Stellar gold  
      vec3 color3 = vec3(0.8, 0.3, 1.0); // Cosmic purple
      
      vec3 finalColor = mix(color1, color2, sin(time * 0.5 + p.x * 2.0) * 0.5 + 0.5);
      finalColor = mix(finalColor, color3, sin(time * 0.3 + p.y * 3.0) * 0.5 + 0.5);
      
      return finalColor * intensity;
    }
    
    // Quantum portal effect
    vec3 quantumPortal(vec2 uv, float time) {
      vec2 center = vec2(0.5, 0.5);
      float dist = length(uv - center);
      
      // Rotating quantum rings
      float angle = atan(uv.y - center.y, uv.x - center.x);
      float rings = sin(dist * 20.0 - time * 3.0) * 0.5 + 0.5;
      rings *= sin(angle * 8.0 + time * 2.0) * 0.5 + 0.5;
      
      // Quantum field distortion
      vec3 fieldPos = vec3(uv * 10.0, time * 0.5);
      float field = quantumField(fieldPos);
      
      float portalIntensity = rings * (1.0 - smoothstep(0.0, 0.8, dist));
      portalIntensity *= (field * 0.5 + 0.5);
      
      return vec3(0.2, 0.8, 1.0) * portalIntensity * 0.3;
    }
    
    // Stellar particles
    vec3 stellarParticles(vec2 uv, float time) {
      vec3 color = vec3(0.0);
      
      for(int i = 0; i < 15; i++) {
        float fi = float(i);
        vec2 pos = vec2(
          sin(time * 0.3 + fi * 2.1) * 0.5 + 0.5,
          cos(time * 0.4 + fi * 1.7) * 0.5 + 0.5
        );
        
        float dist = length(uv - pos);
        float particle = 1.0 / (dist * 300.0 + 1.0);
        
        // Quantum color shift
        vec3 particleColor = vec3(
          sin(time + fi * 2.0) * 0.5 + 0.5,
          cos(time + fi * 3.0) * 0.5 + 0.5,
          sin(time + fi * 4.0) * 0.5 + 0.5
        );
        
        color += particleColor * particle;
      }
      
      return color;
    }
    
    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      vec2 normalizedMouse = u_mouse / u_resolution.xy;
      
      // Time with mouse and scroll influence
      float dynamicTime = u_time + length(normalizedMouse) * 2.0 + u_scroll * 0.5;
      
      // Base quantum field
      vec3 fieldPos = vec3(uv * 8.0, dynamicTime * 0.3);
      float baseField = quantumField(fieldPos) * 0.1;
      
      // Aurora waves
      vec3 aurora = auroraWave(uv, dynamicTime);
      
      // Quantum portal
      vec3 portal = quantumPortal(uv, dynamicTime);
      
      // Stellar particles
      vec3 particles = stellarParticles(uv, dynamicTime);
      
      // Combine all effects
      vec3 finalColor = vec3(baseField) + aurora + portal + particles;
      
      // Add subtle vignette
      vec2 vignetteUV = uv * 2.0 - 1.0;
      float vignette = 1.0 - dot(vignetteUV, vignetteUV) * 0.3;
      finalColor *= vignette;
      
      // Final color enhancement
      finalColor = pow(finalColor, vec3(0.8)); // Gamma correction
      finalColor *= 1.2; // Boost intensity
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  const createShader = useCallback((gl: WebGLRenderingContext, type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }, []);

  const createProgram = useCallback((gl: WebGLRenderingContext) => {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) return null;
    
    const program = gl.createProgram();
    if (!program) return null;
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }
    
    return program;
  }, [createShader]);

  const initWebGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    glRef.current = gl;
    
    const program = createProgram(gl);
    if (!program) return;
    
    programRef.current = program;
    gl.useProgram(program);

    // Create buffer for full-screen quad
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.viewport(0, 0, canvas.width, canvas.height);
  }, [createProgram]);

  const render = useCallback(() => {
    const gl = glRef.current;
    const program = programRef.current;
    
    if (!gl || !program) return;

    timeRef.current += 0.016; // ~60fps
    scrollRef.current = scrollProgress;

    // Update uniforms
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse');
    const scrollLocation = gl.getUniformLocation(program, 'u_scroll');

    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform1f(timeLocation, timeRef.current);
    gl.uniform2f(mouseLocation, mousePosition.x, gl.canvas.height - mousePosition.y);
    gl.uniform1f(scrollLocation, scrollRef.current);

    // Render
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    animationRef.current = requestAnimationFrame(render);
  }, [mousePosition, scrollProgress]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const gl = glRef.current;
    
    if (!canvas || !gl) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    initWebGL();
    render();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initWebGL, render, handleResize]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-20 w-full h-full"
      style={{ 
        background: 'linear-gradient(135deg, #051220 0%, #0a1628 50%, #0f1419 100%)',
        mixBlendMode: 'screen'
      }}
    />
  );
};

export default QuantumWebGLBackground;