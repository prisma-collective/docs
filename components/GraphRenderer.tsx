'use client';

import { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';

cytoscape.use(coseBilkent);

interface NodeElement {
  data: {
    id: string;
    label?: string;
    [key: string]: any;
  };
}

interface EdgeElement {
  data: {
    id: string;
    source: string;
    target: string;
    label?: string;
    [key: string]: any;
  };
}

interface StyleOverride {
  selector: string;
  style: Record<string, any>;
}

interface GraphRendererProps {
  nodes: NodeElement[];
  edges: EdgeElement[];
  styleOverrides?: StyleOverride[];
  layoutOptions?: Record<string, any>;
  containerStyle?: React.CSSProperties;
}

// Default styling configuration
const DEFAULT_STYLES: StyleOverride[] = [
  {
    selector: 'node',
    style: {
      label: 'data(label)',
      'background-color': '#ccc', // Light silver node fill
      color: '#aaa', // Grey label color
      'font-size': '8px',
      'text-valign': 'top',
      'text-halign': 'center',
      'text-margin-y': -10, // Label above the node
      'text-opacity': 0.8,
      'text-background-opacity': 0, // Remove background box
      'width': 12,
      'height': 12,
      shape: 'ellipse', // Circular node
    },
  },
  {
    selector: 'node[label="Participant"]',
    style: {
      'background-color': '#ff4b85',
      'border-color': '#ff4b85',
    },
  },
  {
    selector: 'node[label="TelegramChat"]',
    style: {
      'background-color': '#8067ff',
      'border-color': '#8067ff',
    },
  },
  {
    selector: 'edge',
    style: {
      width: 1,
      'opacity': 0.5,
      'line-color': '#444', // Silver/grey edges
      'target-arrow-color': '#555',
      'target-arrow-shape': 'triangle',
      'arrow-scale': 0.6,
      'curve-style': 'bezier',
      'font-size': '6px',
      color: '#777',
      'text-opacity': 0.6,
      'text-background-opacity': 0,
      'text-margin-y': -8,
    },
  },
  {
    selector: ':selected',
    style: {
      'border-width': 2,
      'border-color': '#fff',
    },
  },
];

// Default layout options
const DEFAULT_LAYOUT_OPTIONS = {
  name: 'cose-bilkent',
  animate: true,
  animationDuration: 1000,
  fit: true,
  nodeRepulsion: 12000,
  idealEdgeLength: 175,
  edgeElasticity: 0.35,
  gravity: 0.15,
  numIter: 3000,
  tile: true,
};

export default function GraphRenderer({ 
  nodes, 
  edges, 
  styleOverrides = [], 
  layoutOptions = {},
  containerStyle = {}
}: GraphRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensures this only renders in the browser
  }, []);

  const filteredEdges = edges.filter(
    (edge) =>
      edge?.data?.id &&
      typeof edge.data.source === 'string' &&
      typeof edge.data.target === 'string'
  );  

  useEffect(() => {
    if (!containerRef.current) return;

    // Merge default styles with overrides
    const mergedStyles = [...DEFAULT_STYLES, ...styleOverrides];
    
    // Merge default layout options with overrides
    const mergedLayoutOptions = { ...DEFAULT_LAYOUT_OPTIONS, ...layoutOptions };

    const cy = cytoscape({
      container: containerRef.current,
      minZoom: 0.35,   // Prevent zooming out too far
      maxZoom: 2.5,   // Prevent zooming in too far
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
      autounselectify: true,
      wheelSensitivity: 0.2,
      elements: {
        nodes,
        edges: filteredEdges,
      },
      style: mergedStyles,
      layout: mergedLayoutOptions as any,
    });

    // Limit how far users can pan
    cy.on('pan', () => {
      const pan = cy.pan();
      const zoom = cy.zoom();
      const basePanLimit = 800;
    
      const scaledLimit = basePanLimit * zoom; // Zoom-aware limit

      const clampedX = Math.max(-scaledLimit, Math.min(pan.x, scaledLimit));
      const clampedY = Math.max(-scaledLimit, Math.min(pan.y, scaledLimit));
    
      if (pan.x !== clampedX || pan.y !== clampedY) {
        cy.pan({ x: clampedX, y: clampedY });
      }
    });

    cy.on('zoom', () => {
      const zoom = cy.zoom();
      const opacity = zoom > 0.6 ? 1 : zoom > 0.4 ? 0.7 : 0.3;
    
      cy.nodes().forEach((node) => {
        node.style('text-opacity', opacity);
      });
    });
    

    return () => cy.destroy(); // Cleanup
  }, [isClient, nodes, edges, styleOverrides, layoutOptions]);

  if (!isClient) return null;

  const defaultContainerStyle = { width: '100%', height: '600px' };
  const finalContainerStyle = { ...defaultContainerStyle, ...containerStyle };

  return <div ref={containerRef} style={finalContainerStyle} />;
}
