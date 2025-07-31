import React, { useRef, useEffect } from 'react';

interface QuantumTextFieldProps {
  text: string;
  className?: string;
  speed?: number;
  quantumEffect?: boolean;
}

const QuantumTextField: React.FC<QuantumTextFieldProps> = ({
  text,
  className = '',
  speed = 0.5,
  quantumEffect = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!quantumEffect || !canvasRef.current || !textRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const textElement = textRef.current;
    const rect = textElement.getBoundingClientRect();
    
    canvas.width = rect.width;
    canvas.height = rect.height;

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.016 * speed;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Quantum field effects
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const phase = time + i * 0.1;
        
        // Quantum particle
        const alpha = Math.sin(phase) * 0.3 + 0.1;
        const size = Math.abs(Math.sin(phase * 2) * 2) + 0.5; // Ensure positive size
        
        ctx.globalAlpha = alpha;
        ctx.fillStyle = i % 3 === 0 
          ? '#4FFFEF' 
          : i % 3 === 1 
          ? '#FFD700' 
          : '#DA70D6';
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Quantum connections
        if (i < 25) {
          const x2 = Math.random() * canvas.width;
          const y2 = Math.random() * canvas.height;
          const distance = Math.sqrt((x2 - x) ** 2 + (y2 - y) ** 2);
          
          if (distance < 100) {
            ctx.globalAlpha = (1 - distance / 100) * 0.2;
            ctx.strokeStyle = '#4FFFEF';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }
      }
      
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [speed, quantumEffect]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={textRef}
        className="relative z-10 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
        style={{
          backgroundSize: '200% 100%',
          animation: 'gradient-flow 3s ease-in-out infinite'
        }}
      >
        {text}
      </div>
      {quantumEffect && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{ mixBlendMode: 'screen' }}
        />
      )}
    </div>
  );
};

export default QuantumTextField;