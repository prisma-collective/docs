"use client"

import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

// Define types for the contributor data structure
interface ContributorHistory {
  week: string;
  commits: number;
}

interface ContributorData {
  user: string;
  history: ContributorHistory[];
}

// Brand color palette
const brandColors = ["#cd5aff", "#8067ff", "#ef64ff", "#ff4b85"];

// Function to get color from the brand palette, cycling through if there are more contributors than colors
function getBrandColor(index: number): string {
  return brandColors[index % brandColors.length];
}

const ContributorChart: React.FC = () => {
  const [data, setData] = useState<ContributorData[] | null>(null);
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  // Fetch contributor data when the component mounts
  useEffect(() => {
    fetch("/api/contributors")
      .then((response) => response.json())
      .then((data: ContributorData[]) => setData(data))
      .catch((err) => console.error('Error fetching contributors: ', err));
  }, []);

  // Chart rendering logic
  useEffect(() => {
    if (data && chartRef.current) {

      const chartData = {
        labels: [] as string[],  // Array to store weeks
        datasets: [] as {
          label: string;
          data: number[];
          fill: boolean;
          borderColor: string;
          tension: number;
        }[] // Array to store the data for each contributor
      };

      // Fill in weeks from the first contributor's history
      if (data.length > 0) {
        chartData.labels = data[0].history.map((h) => h.week);
      }

      data.forEach((entry, index) => {
        const user = entry.user;
        const history = entry.history;

        const userCommits = history.map((h) => h.commits);

        chartData.datasets.push({
          label: user,
          data: userCommits,
          fill: false,
          borderColor: getBrandColor(index),
          tension: 0.4,
        });
      });

      // Create the chart
      new Chart(chartRef.current, {
        type: 'line', // Use a line chart
        data: chartData,
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true, // Ensure the y-axis starts at 0
            },
          },
          plugins: {
            legend: {
              display: false, // Hide the legend
            },
          },
        },
      });
    }
  }, [data]); // Run the effect when data is fetched

  return (
    <div>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ContributorChart;
