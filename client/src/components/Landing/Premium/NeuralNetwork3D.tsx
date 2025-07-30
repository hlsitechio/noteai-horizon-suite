import React, { useEffect, useRef, useState } from 'react';

interface Node {
  id: number;
  x: number;
  y: number;
  connections: number[];
  pulseDelay: number;
}

interface NeuralNetworkProps {
  nodeCount?: number;
  width?: number;
  height?: number;
  interactive?: boolean;
}

const NeuralNetwork3D: React.FC<NeuralNetworkProps> = ({ 
  nodeCount = 30, 
  width = 800, 
  height = 600, 
  interactive = true 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [nodes, setNodes] = useState<Node[]>([]);

  useEffect(() => {
    // Generate neural network nodes
    const generatedNodes: Node[] = [];
    
    for (let i = 0; i < nodeCount; i++) {
      const node: Node = {
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        connections: [],
        pulseDelay: Math.random() * 2000
      };
      generatedNodes.push(node);
    }

    // Create connections between nearby nodes
    generatedNodes.forEach((node, i) => {
      generatedNodes.forEach((otherNode, j) => {
        if (i !== j) {
          const distance = Math.sqrt(
            Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
          );
          
          if (distance < 150 && Math.random() < 0.3) {
            node.connections.push(j);
          }
        }
      });
    });

    setNodes(generatedNodes);
  }, [nodeCount, width, height]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  };

  return (
    <div 
      ref={containerRef}
      className="relative overflow-hidden bg-neural-mesh neural-perspective"
      style={{ width, height }}
      onMouseMove={handleMouseMove}
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-cyberpunk-grid opacity-30" />
      
      {/* Neural connections */}
      <svg 
        className="absolute inset-0 w-full h-full"
        style={{ width, height }}
      >
        {nodes.map((node) =>
          node.connections.map((connectionId) => {
            const targetNode = nodes[connectionId];
            if (!targetNode) return null;
            
            const distance = Math.sqrt(
              Math.pow(mousePosition.x - node.x, 2) + Math.pow(mousePosition.y - node.y, 2)
            );
            const isNearMouse = distance < 100;
            
            return (
              <line
                key={`${node.id}-${connectionId}`}
                x1={node.x}
                y1={node.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke="url(#neuralGradient)"
                strokeWidth={isNearMouse ? "2" : "1"}
                opacity={isNearMouse ? "0.8" : "0.3"}
                className="neural-connection transition-all duration-300"
                style={{
                  filter: isNearMouse ? 'drop-shadow(0 0 10px hsl(var(--primary)))' : 'none'
                }}
              />
            );
          })
        )}
        
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(280 100% 70%)" stopOpacity="1" />
            <stop offset="50%" stopColor="hsl(195 100% 50%)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(315 100% 60%)" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Neural nodes */}
      {nodes.map((node) => {
        const distance = Math.sqrt(
          Math.pow(mousePosition.x - node.x, 2) + Math.pow(mousePosition.y - node.y, 2)
        );
        const isNearMouse = distance < 100;
        const scale = isNearMouse ? 1.5 : 1;
        
        return (
          <div
            key={node.id}
            className="neural-node absolute pointer-events-none"
            style={{
              left: node.x - 6,
              top: node.y - 6,
              transform: `scale(${scale})`,
              animationDelay: `${node.pulseDelay}ms`,
              filter: isNearMouse ? 'brightness(1.5) saturate(1.3)' : 'none'
            }}
          />
        );
      })}
      
      {/* Floating cyberpunk elements */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full neural-float opacity-50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      {/* Mouse interaction effect */}
      {interactive && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: mousePosition.x - 50,
            top: mousePosition.y - 50,
            width: 100,
            height: 100,
            background: 'radial-gradient(circle, hsl(var(--primary) / 0.3), transparent 70%)',
            borderRadius: '50%',
            transition: 'all 0.3s ease',
            opacity: mousePosition.x || mousePosition.y ? 1 : 0
          }}
        />
      )}
    </div>
  );
};

export default NeuralNetwork3D;