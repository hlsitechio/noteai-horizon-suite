import React, { useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface DataFlowBackgroundProps {
  mousePosition: { x: number; y: number };
  scrollProgress?: number;
}

const DataFlowBackground: React.FC<DataFlowBackgroundProps> = ({ 
  mousePosition, 
  scrollProgress = 0 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const nodesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    connections: number[];
    pulsePhase: number;
  }>>([]);

  const initializeNodes = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const nodeCount = 80;
    const nodes = [];
    const colors = [
      'hsl(200, 80%, 60%)',  // Cyan
      'hsl(280, 80%, 70%)',  // Purple
      'hsl(320, 80%, 65%)',  // Pink
      'hsl(180, 90%, 55%)',  // Turquoise
      'hsl(240, 85%, 65%)',  // Blue
    ];

    for (let i = 0; i < nodeCount; i++) {
      const node = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        connections: [],
        pulsePhase: Math.random() * Math.PI * 2,
      };
      nodes.push(node);
    }

    // Create connections between nearby nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150 && Math.random() < 0.3) {
          nodes[i].connections.push(j);
        }
      }
    }

    nodesRef.current = nodes;
  }, []);

  const drawDataFlow = useCallback((ctx: CanvasRenderingContext2D, time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Mouse influence
    const mouseInfluence = 100;
    const mouseX = mousePosition.x;
    const mouseY = mousePosition.y;

    // Update and draw nodes
    nodesRef.current.forEach((node, index) => {
      // Mouse attraction/repulsion
      const dx = mouseX - node.x;
      const dy = mouseY - node.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < mouseInfluence) {
        const force = (mouseInfluence - distance) / mouseInfluence;
        node.vx += (dx / distance) * force * 0.02;
        node.vy += (dy / distance) * force * 0.02;
      }

      // Update position
      node.x += node.vx;
      node.y += node.vy;

      // Boundary wrapping
      if (node.x < 0) node.x = canvas.width;
      if (node.x > canvas.width) node.x = 0;
      if (node.y < 0) node.y = canvas.height;
      if (node.y > canvas.height) node.y = 0;

      // Apply friction
      node.vx *= 0.99;
      node.vy *= 0.99;

      // Update pulse phase
      node.pulsePhase += 0.02;
    });

    // Draw connections first (behind nodes)
    nodesRef.current.forEach((node, index) => {
      node.connections.forEach(connectedIndex => {
        if (connectedIndex < nodesRef.current.length) {
          const connectedNode = nodesRef.current[connectedIndex];
          const dx = connectedNode.x - node.x;
          const dy = connectedNode.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) {
            // Create flowing data effect
            const opacity = (200 - distance) / 200 * 0.6;
            const gradient = ctx.createLinearGradient(node.x, node.y, connectedNode.x, connectedNode.y);
            
            // Animate gradient colors
            const colorShift = Math.sin(time * 0.001 + index * 0.1) * 0.5 + 0.5;
            gradient.addColorStop(0, node.color.replace(')', `, ${opacity})`).replace('hsl', 'hsla'));
            gradient.addColorStop(colorShift, connectedNode.color.replace(')', `, ${opacity * 0.8})`).replace('hsl', 'hsla'));
            gradient.addColorStop(1, connectedNode.color.replace(')', `, ${opacity})`).replace('hsl', 'hsla'));

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1 + Math.sin(time * 0.002 + index * 0.2) * 0.5;
            ctx.globalCompositeOperation = 'screen';
            
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            
            // Create curved connections
            const midX = (node.x + connectedNode.x) / 2 + Math.sin(time * 0.001 + index) * 20;
            const midY = (node.y + connectedNode.y) / 2 + Math.cos(time * 0.001 + index) * 20;
            ctx.quadraticCurveTo(midX, midY, connectedNode.x, connectedNode.y);
            ctx.stroke();

            // Draw flowing particles along the line
            const flowProgress = (Math.sin(time * 0.003 + index * 0.5) + 1) / 2;
            const particleX = node.x + dx * flowProgress;
            const particleY = node.y + dy * flowProgress;
            
            ctx.fillStyle = node.color.replace(')', ', 0.8)').replace('hsl', 'hsla');
            ctx.beginPath();
            ctx.arc(particleX, particleY, 2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.globalCompositeOperation = 'source-over';
          }
        }
      });
    });

    // Draw nodes
    nodesRef.current.forEach((node, index) => {
      const pulseSize = node.size + Math.sin(node.pulsePhase) * 0.5;
      const glowSize = pulseSize * 3;

      // Draw glow
      const glowGradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowSize);
      glowGradient.addColorStop(0, node.color.replace(')', ', 0.4)').replace('hsl', 'hsla'));
      glowGradient.addColorStop(1, node.color.replace(')', ', 0)').replace('hsl', 'hsla'));
      
      ctx.fillStyle = glowGradient;
      ctx.globalCompositeOperation = 'screen';
      ctx.beginPath();
      ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
      ctx.fill();

      // Draw core
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = node.color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
      ctx.fill();

      // Draw inner bright spot
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(node.x - pulseSize * 0.3, node.y - pulseSize * 0.3, pulseSize * 0.3, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [mousePosition]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    timeRef.current += 16; // ~60fps
    drawDataFlow(ctx, timeRef.current);
    animationRef.current = requestAnimationFrame(animate);
  }, [drawDataFlow]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initializeNodes();
  }, [initializeNodes]);

  useEffect(() => {
    handleResize();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleResize, animate]);

  return (
    <>
      {/* Canvas for data flow */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-10 w-full h-full"
        style={{ background: 'transparent' }}
      />
      
      {/* Additional overlay effects */}
      <div className="fixed inset-0 -z-5 pointer-events-none">
        {/* Radial gradient from mouse position */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, 
              hsl(200 80% 60% / 0.2), 
              hsl(280 80% 70% / 0.1), 
              transparent 40%)`
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Floating data streams */}
        <div className="absolute inset-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-32 opacity-40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `linear-gradient(0deg, 
                  transparent, 
                  hsl(${200 + i * 20} 80% 60% / 0.6), 
                  transparent)`,
                transformOrigin: 'center bottom'
              }}
              animate={{
                rotate: [0, 360],
                scale: [0.8, 1.2, 0.8],
                opacity: [0.2, 0.6, 0.2]
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                delay: i * 0.7,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default DataFlowBackground;