import React from 'react';
import { FlowchartData } from '../../../server/services/gemini';

interface FlowchartViewerProps {
  data: FlowchartData;
  className?: string;
}

const FlowchartViewer: React.FC<FlowchartViewerProps> = ({ data, className = '' }) => {
  const getNodeStyle = (type: string) => {
    const baseStyle = {
      position: 'absolute' as const,
      padding: '12px 16px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      border: '2px solid #6366f1',
      backgroundColor: '#f8fafc',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      minWidth: '120px',
      textAlign: 'center' as const,
      zIndex: 10,
    };

    switch (type) {
      case 'start':
      case 'end':
        return {
          ...baseStyle,
          borderRadius: '50px',
          backgroundColor: type === 'start' ? '#dcfce7' : '#fef2f2',
          borderColor: type === 'start' ? '#16a34a' : '#dc2626',
          color: type === 'start' ? '#15803d' : '#b91c1c',
        };
      case 'decision':
        return {
          ...baseStyle,
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          backgroundColor: '#fef3c7',
          borderColor: '#f59e0b',
          color: '#92400e',
          minWidth: '140px',
          minHeight: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        };
      case 'input':
      case 'output':
        return {
          ...baseStyle,
          clipPath: 'polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)',
          backgroundColor: '#e0e7ff',
          borderColor: '#3b82f6',
          color: '#1d4ed8',
        };
      default: // process
        return {
          ...baseStyle,
          borderRadius: '6px',
          backgroundColor: '#f0f9ff',
          borderColor: '#0ea5e9',
          color: '#0c4a6e',
        };
    }
  };

  const calculateEdgePath = (from: any, to: any) => {
    const fromNode = data.nodes.find(n => n.id === from);
    const toNode = data.nodes.find(n => n.id === to);
    
    if (!fromNode || !toNode) return '';

    const startX = fromNode.x + 60; // Center of node
    const startY = fromNode.y + 20;
    const endX = toNode.x + 60;
    const endY = toNode.y + 20;

    // Create a simple curved line
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    const controlY = midY - Math.abs(endX - startX) * 0.1;

    return `M ${startX} ${startY} Q ${midX} ${controlY} ${endX} ${endY}`;
  };

  const calculateArrowPosition = (from: any, to: any) => {
    const fromNode = data.nodes.find(n => n.id === from);
    const toNode = data.nodes.find(n => n.id === to);
    
    if (!fromNode || !toNode) return { x: 0, y: 0, angle: 0 };

    const startX = fromNode.x + 60;
    const startY = fromNode.y + 20;
    const endX = toNode.x + 60;
    const endY = toNode.y + 20;

    const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;

    return {
      x: endX - 8,
      y: endY - 4,
      angle
    };
  };

  return (
    <div className={`relative bg-gray-50 border rounded-lg overflow-auto ${className}`} style={{ height: '600px' }}>
      <svg 
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 600"
        style={{ zIndex: 1 }}
      >
        {/* Render edges */}
        {data.edges.map((edge, index) => {
          const path = calculateEdgePath(edge.from, edge.to);
          const arrow = calculateArrowPosition(edge.from, edge.to);
          
          return (
            <g key={index}>
              <path
                d={path}
                stroke="#6366f1"
                strokeWidth="2"
                fill="none"
                markerEnd="url(#arrowhead)"
              />
              {edge.label && (
                <text
                  x={(data.nodes.find(n => n.id === edge.from)?.x || 0) + 60}
                  y={(data.nodes.find(n => n.id === edge.from)?.y || 0) + 50}
                  fill="#6366f1"
                  fontSize="12"
                  textAnchor="middle"
                  className="font-medium"
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}
        
        {/* Arrow marker definition */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#6366f1"
            />
          </marker>
        </defs>
      </svg>

      {/* Render nodes */}
      {data.nodes.map((node) => (
        <div
          key={node.id}
          style={{
            ...getNodeStyle(node.type),
            left: `${node.x}px`,
            top: `${node.y}px`,
          }}
          title={`${node.type}: ${node.label}`}
        >
          {node.label}
        </div>
      ))}
    </div>
  );
};

export default FlowchartViewer;