"use client";

import { useEffect, useState } from "react";
import GraphRenderer from "./GraphRenderer";

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

export default function GraphLoader() {
  const [graphData, setGraphData] = useState<{ nodes: NodeElement[]; edges: EdgeElement[] } | null>(null);

  useEffect(() => {
    const loadGraph = async () => {
      const res = await fetch("/api/graph");

      if (!res.body) {
        console.error("No stream body found.");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let result = "";
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        if (value) result += decoder.decode(value);
        done = doneReading;
      }

      try {
        const parsed = JSON.parse(result);
        setGraphData(parsed);
      } catch (e) {
        console.error("Error parsing graph data:", e);
      }
    };

    loadGraph();
  }, []);

  if (!graphData) return <div>Loading graph...</div>;

  return (
    <div>
      <GraphRenderer nodes={graphData.nodes} edges={graphData.edges} />
    </div>
  );
}

