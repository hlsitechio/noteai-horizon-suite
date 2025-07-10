import React, { useRef, useEffect } from 'react';

interface SimpleParticleFieldProps {
  mousePosition: { x: number; y: number };
  intensity?: number;
}

const SimpleParticleField: React.FC<SimpleParticleFieldProps> = ({ 
  mousePosition, 
  intensity = 1 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Initialize particles
    const particleCount = 150;
    particlesRef.current = [];
    
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        color: i % 3 === 0 ? '#4FFFEF' : i % 3 === 1 ? '#FFD700' : '#DA70D6',
        phase: Math.random() * Math.PI * 2
      });
    }

    let time = 0;

    const animate = () => {
      time += 0.016;
      
      ctx.fillStyle = 'rgba(8, 20, 40, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, i) => {
        // Update position with quantum field effect
        particle.x += particle.vx + Math.sin(time + particle.phase) * 0.5;
        particle.y += particle.vy + Math.cos(time + particle.phase) * 0.5;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Mouse interaction
        const dx = mousePosition.x - particle.x;
        const dy = mousePosition.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150;
          particle.vx += (dx / distance) * force * 0.02;
          particle.vy += (dy / distance) * force * 0.02;
        }

        // Apply velocity damping
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Pulsing effect
        const pulse = Math.sin(time * 2 + particle.phase) * 0.3 + 0.7;
        const currentOpacity = particle.opacity * pulse;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace(')', `, ${currentOpacity})`).replace('#', 'rgba(').replace(/(.{2})(.{2})(.{2})/, (_, r, g, b) => {
          return `rgba(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}, ${currentOpacity})`;
        });
        ctx.fill();

        // Draw connections to nearby particles
        particlesRef.current.forEach((otherParticle, j) => {
          if (i !== j) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
              const opacity = (1 - distance / 120) * 0.3;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = `rgba(79, 255, 239, ${opacity})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePosition, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-15 pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default SimpleParticleField;