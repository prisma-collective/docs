# prisma

prisma is a distributed action-learning incubator. we organise and facilitate [[action-learning journeys]] so that [[bioregion|bioregional]] communities can participate more fully in transition pathways toward life-affirming futures.

we bring active facilitation to work at three levels of incubation:

1. **PRODUCTS:** Making visible the application of practice by action-learning groups on-the-ground. 
2. **ORGANISATIONS:** Securing longer-term viability of a given team's line of work.
3. **ECOSYSTEMS:** Multiple levels of actors, partnerships, aims. 

![[levels-of-work.png]]
## High-Level Overview

1. [[Bioregional Celebration Festival]]
2. [[Core Value-Adding Process and Business Model]]
3. [[Stakeholders and Growth Strategy]]
4. [[Replace Academy Case Study]]
5. [[playbook/0. overview|Organising Playbook]]

## Contributions

<canvas id="contributionsChart"></canvas>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
  // Brand color palette
  const brandColors = ["#cd5aff", "#8067ff", "#ef64ff", "#ff4b85"];

  // Function to get color from the brand palette, cycling through if there are more contributors than colors
  function getBrandColor(index) {
    return brandColors[index % brandColors.length];
  }

  fetch("contributions.json")
    .then(response => response.json())
    .then(data => {
      const ctx = document.getElementById('contributionsChart').getContext('2d');
      
      // Prepare the dataset for each contributor
      const chartData = {
        labels: [],  // Array to store months
        datasets: [] // Array to store the data for each contributor
      };

      // Loop through each contributor
      data.forEach((entry, index) => {
        const user = entry.user;
        const history = entry.history;

        // Fill in the labels (months) from the first contributor's data
        if (chartData.labels.length === 0) {
          chartData.labels = history.map(h => h.month);
        }

        // Prepare the data for each contributor
        const userCommits = history.map(h => h.commits);
        chartData.datasets.push({
          label: user,
          data: userCommits,
          fill: false, // No filling under the line
          borderColor: getBrandColor(index), // Use brand color from the palette
          tension: 0.4 // Makes the line smooth
        });
      });

      // Create the chart
      new Chart(ctx, {
        type: 'line', // Use a line chart
        data: chartData,
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true, // Ensure the y-axis starts at 0
            }
          },
          plugins: {
            legend: {
              display: false // Hide the legend
            }
          }
        }
      });
    });
</script>