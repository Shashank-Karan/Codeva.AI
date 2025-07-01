import React from 'react';
import { FlowchartData } from '../../../server/services/gemini';

interface FlowchartViewerProps {
  data: FlowchartData;
  className?: string;
}

const FlowchartViewer: React.FC<FlowchartViewerProps> = ({ data, className = '' }) => {
  // Responsive scaling based on container
  const getResponsiveLayout = () => {
    const baseWidth = 800;
    const baseHeight = 600;
    return { width: baseWidth, height: baseHeight };
  };

  const layout = getResponsiveLayout();

  const getScaledPosition = (x: number, y: number) => {
    return {
      x: Math.max(20, Math.min(layout.width - 180, (x / 1000) * layout.width)),
      y: Math.max(20, Math.min(layout.height - 80, (y / 600) * layout.height))
    };
  };

  const getNodeDimensions = (type: string) => {
    switch (type) {
      case 'start':
      case 'end':
        return { width: 140, height: 60 };
      case 'decision':
        return { width: 120, height: 80 };
      case 'input':
      case 'output':
        return { width: 150, height: 50 };
      default: // process
        return { width: 140, height: 50 };
    }
  };

  const renderNode = (node: any) => {
    const pos = getScaledPosition(node.x, node.y);
    const dims = getNodeDimensions(node.type);
    const id = `node-${node.id}`;

    switch (node.type) {
      case 'start':
      case 'end':
        return (
          <g key={node.id}>
            <ellipse
              cx={pos.x + dims.width / 2}
              cy={pos.y + dims.height / 2}
              rx={dims.width / 2}
              ry={dims.height / 2}
              fill={node.type === 'start' ? '#ffffff' : '#ffffff'}
              stroke={node.type === 'start' ? '#22c55e' : '#ef4444'}
              strokeWidth="2"
              filter="url(#shadow)"
            />
            <text
              x={pos.x + dims.width / 2}
              y={pos.y + dims.height / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#374151"
              fontSize="14"
              fontWeight="500"
            >
              {node.label}
            </text>
          </g>
        );

      case 'decision':
        const centerX = pos.x + dims.width / 2;
        const centerY = pos.y + dims.height / 2;
        const halfWidth = dims.width / 2;
        const halfHeight = dims.height / 2;
        return (
          <g key={node.id}>
            <polygon
              points={`${centerX},${centerY - halfHeight} ${centerX + halfWidth},${centerY} ${centerX},${centerY + halfHeight} ${centerX - halfWidth},${centerY}`}
              fill="#ffffff"
              stroke="#f59e0b"
              strokeWidth="2"
              filter="url(#shadow)"
            />
            <text
              x={centerX}
              y={centerY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#374151"
              fontSize="12"
              fontWeight="500"
            >
              {node.label}
            </text>
          </g>
        );

      case 'input':
      case 'output':
        const skew = 15;
        return (
          <g key={node.id}>
            <polygon
              points={`${pos.x + skew},${pos.y} ${pos.x + dims.width},${pos.y} ${pos.x + dims.width - skew},${pos.y + dims.height} ${pos.x},${pos.y + dims.height}`}
              fill="#ffffff"
              stroke={node.type === 'input' ? '#3b82f6' : '#8b5cf6'}
              strokeWidth="2"
              filter="url(#shadow)"
            />
            <text
              x={pos.x + dims.width / 2}
              y={pos.y + dims.height / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#374151"
              fontSize="13"
              fontWeight="500"
            >
              {node.label}
            </text>
          </g>
        );

      default: // process
        return (
          <g key={node.id}>
            <rect
              x={pos.x}
              y={pos.y}
              width={dims.width}
              height={dims.height}
              rx="4"
              fill="#ffffff"
              stroke="#06b6d4"
              strokeWidth="2"
              filter="url(#shadow)"
            />
            <text
              x={pos.x + dims.width / 2}
              y={pos.y + dims.height / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#374151"
              fontSize="13"
              fontWeight="500"
            >
              {node.label}
            </text>
          </g>
        );
    }
  };

  const getConnectionPoints = (fromNode: any, toNode: any) => {
    const fromPos = getScaledPosition(fromNode.x, fromNode.y);
    const toPos = getScaledPosition(toNode.x, toNode.y);
    const fromDims = getNodeDimensions(fromNode.type);
    const toDims = getNodeDimensions(toNode.type);

    const fromCenterX = fromPos.x + fromDims.width / 2;
    const fromCenterY = fromPos.y + fromDims.height / 2;
    const toCenterX = toPos.x + toDims.width / 2;
    const toCenterY = toPos.y + toDims.height / 2;

    // Calculate connection points on node edges
    let startX, startY, endX, endY;

    // Determine direction
    const dx = toCenterX - fromCenterX;
    const dy = toCenterY - fromCenterY;

    // From node exit point
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal connection
      if (dx > 0) {
        startX = fromPos.x + fromDims.width;
        startY = fromCenterY;
      } else {
        startX = fromPos.x;
        startY = fromCenterY;
      }
    } else {
      // Vertical connection
      if (dy > 0) {
        startX = fromCenterX;
        startY = fromPos.y + fromDims.height;
      } else {
        startX = fromCenterX;
        startY = fromPos.y;
      }
    }

    // To node entry point
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal connection
      if (dx > 0) {
        endX = toPos.x;
        endY = toCenterY;
      } else {
        endX = toPos.x + toDims.width;
        endY = toCenterY;
      }
    } else {
      // Vertical connection
      if (dy > 0) {
        endX = toCenterX;
        endY = toPos.y;
      } else {
        endX = toCenterX;
        endY = toPos.y + toDims.height;
      }
    }

    return { startX, startY, endX, endY };
  };

  const renderConnection = (edge: any, index: number) => {
    const fromNode = data.nodes.find(n => n.id === edge.from);
    const toNode = data.nodes.find(n => n.id === edge.to);
    
    if (!fromNode || !toNode) return null;

    const { startX, startY, endX, endY } = getConnectionPoints(fromNode, toNode);

    // Create path with rounded corners for professional look
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    
    let pathData;
    if (Math.abs(endX - startX) > Math.abs(endY - startY)) {
      // Horizontal path
      pathData = `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`;
    } else {
      // Vertical path
      pathData = `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`;
    }

    return (
      <g key={index}>
        <path
          d={pathData}
          fill="none"
          stroke="#374151"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
        {edge.label && (
          <text
            x={midX}
            y={midY - 10}
            textAnchor="middle"
            fill="#6b7280"
            fontSize="12"
            fontWeight="500"
          >
            {edge.label}
          </text>
        )}
      </g>
    );
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
    <div className={`w-full bg-white border rounded-lg overflow-hidden ${className}`}>
      <div className="w-full overflow-auto" style={{ minHeight: '500px' }}>
        <svg 
          width="100%"
          height="600"
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          className="min-w-full"
          style={{ background: '#fafafa' }}
        >
          <defs>
            {/* Shadow filter */}
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#00000020"/>
            </filter>
            
            {/* Arrow marker */}
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#374151"
              />
            </marker>
          </defs>

          {/* Grid pattern for professional look */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Render connections */}
          {data.edges && data.edges.map((edge, index) => renderConnection(edge, index))}

          {/* Render nodes */}
          {data.nodes.map(node => renderNode(node))}
        </svg>
      </div>

      {/* Professional legend */}
      <div className="border-t bg-gray-50 p-4">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 border-2 border-green-500 bg-white rounded-full"></div>
            <span className="text-gray-700">Start/End</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 border-2 border-cyan-500 bg-white"></div>
            <span className="text-gray-700">Process</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-amber-500 bg-white transform rotate-45"></div>
            <span className="text-gray-700">Decision</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 border-2 border-blue-500 bg-white transform skew-x-12"></div>
            <span className="text-gray-700">Input/Output</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowchartViewer;