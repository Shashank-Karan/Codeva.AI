import React from 'react';
import { FlowchartData } from '../../../server/services/gemini';

interface FlowchartViewerProps {
  data: FlowchartData;
  className?: string;
}

const FlowchartViewer: React.FC<FlowchartViewerProps> = ({ data, className = '' }) => {
  // Scale nodes to fit in container
  const getScaledPosition = (x: number, y: number) => {
    const containerWidth = 800;
    const containerHeight = 500;
    return {
      x: Math.max(10, Math.min(containerWidth - 150, (x / 1000) * containerWidth)),
      y: Math.max(10, Math.min(containerHeight - 60, (y / 600) * containerHeight))
    };
  };

  const getNodeStyle = (node: any) => {
    const scaled = getScaledPosition(node.x, node.y);
    
    const baseStyle = {
      position: 'absolute' as const,
      left: `${scaled.x}px`,
      top: `${scaled.y}px`,
      padding: '10px 15px',
      fontSize: '13px',
      fontWeight: '600',
      border: '2px solid',
      borderRadius: '6px',
      backgroundColor: '#ffffff',
      cursor: 'default',
      minWidth: '120px',
      maxWidth: '180px',
      textAlign: 'center' as const,
      zIndex: 10,
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      wordWrap: 'break-word' as const,
      lineHeight: '1.4',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '45px'
    };

    switch (node.type) {
      case 'start':
        return {
          ...baseStyle,
          borderRadius: '30px',
          backgroundColor: '#10b981',
          borderColor: '#059669',
          color: '#ffffff',
        };
      case 'end':
        return {
          ...baseStyle,
          borderRadius: '30px',
          backgroundColor: '#ef4444',
          borderColor: '#dc2626',
          color: '#ffffff',
        };
      case 'decision':
        return {
          ...baseStyle,
          borderRadius: '0',
          transform: 'rotate(45deg)',
          backgroundColor: '#f59e0b',
          borderColor: '#d97706',
          color: '#ffffff',
          minWidth: '100px',
          minHeight: '100px',
        };
      case 'input':
        return {
          ...baseStyle,
          backgroundColor: '#3b82f6',
          borderColor: '#2563eb',
          color: '#ffffff',
          clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)',
        };
      case 'output':
        return {
          ...baseStyle,
          backgroundColor: '#8b5cf6',
          borderColor: '#7c3aed',
          color: '#ffffff',
          clipPath: 'polygon(0% 0%, 90% 0%, 100% 100%, 10% 100%)',
        };
      default: // process
        return {
          ...baseStyle,
          backgroundColor: '#06b6d4',
          borderColor: '#0891b2',
          color: '#ffffff',
        };
    }
  };

  const getConnectionPoints = (from: string, to: string) => {
    const fromNode = data.nodes.find(n => n.id === from);
    const toNode = data.nodes.find(n => n.id === to);
    
    if (!fromNode || !toNode) return null;

    const fromPos = getScaledPosition(fromNode.x, fromNode.y);
    const toPos = getScaledPosition(toNode.x, toNode.y);

    const startX = fromPos.x + 60;
    const startY = fromPos.y + 25;
    const endX = toPos.x + 60;
    const endY = toPos.y + 25;

    return {
      startX,
      startY,
      endX,
      endY,
      midX: (startX + endX) / 2,
      midY: (startY + endY) / 2
    };
  };

  if (!data || !data.nodes || data.nodes.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 border rounded-lg ${className}`} style={{ height: '400px' }}>
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">📊</div>
          <p>No flowchart data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-gradient-to-br from-blue-50 to-indigo-50 border rounded-lg overflow-hidden ${className}`} style={{ height: '500px', width: '100%' }}>
      <svg 
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 800 500"
        style={{ zIndex: 1 }}
      >
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
              fill="#4f46e5"
            />
          </marker>
        </defs>
        
        {data.edges && data.edges.map((edge, index) => {
          const points = getConnectionPoints(edge.from, edge.to);
          if (!points) return null;
          
          return (
            <g key={index}>
              <line
                x1={points.startX}
                y1={points.startY}
                x2={points.endX}
                y2={points.endY}
                stroke="#4f46e5"
                strokeWidth="3"
                markerEnd="url(#arrowhead)"
                strokeDasharray="none"
              />
              {edge.label && (
                <text
                  x={points.midX}
                  y={points.midY - 8}
                  fill="#4f46e5"
                  fontSize="12"
                  textAnchor="middle"
                  fontWeight="600"
                  style={{ 
                    textShadow: '1px 1px 2px rgba(255,255,255,0.9)',
                    filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.1))'
                  }}
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {data.nodes.map((node) => (
        <div
          key={node.id}
          style={getNodeStyle(node)}
          title={`${node.type.toUpperCase()}: ${node.label}`}
        >
          <div style={{ 
            transform: node.type === 'decision' ? 'rotate(-45deg)' : 'none',
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {node.label}
          </div>
        </div>
      ))}
      
      {/* Simple legend */}
      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg p-3 text-xs border shadow-lg">
        <div className="font-bold mb-2 text-gray-700">Flow Elements</div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-emerald-500 flex-shrink-0"></div>
            <span className="text-gray-600">Start</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-cyan-500 flex-shrink-0"></div>
            <span className="text-gray-600">Process</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-500 rotate-45 flex-shrink-0"></div>
            <span className="text-gray-600">Decision</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500 flex-shrink-0"></div>
            <span className="text-gray-600">End</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowchartViewer;