# prisma

prisma is... 

- a [[process design collective]] 
- an [[action-learning]] framework 
- an incubator 

we facilitate [[action-learning journeys]] so that [[bioregion|bioregional]] communities can participate more fully in transition pathways toward life-affirming futures.

we work at three levels:

1. **PRODUCTS:** To develop technology products for clients from a living systems paradigm.
1. **ORGANISATIONS:** To incubate teams as instruments in creating the conditions for participating in systems evolution.
1. **ECOSYSTEMS:** To catalyse venture development ecosystems in partner bioregions to build public goods infrastructures.

![[levels-of-work.png]]
## The Overall Narrative

1. [[Bioregional Celebration Festival]]
3. [[The Challenge We're Addressing]]
4. [[Introducing Our Solution]]
5. [[Core Value-Adding Process and Business Model]]
6. [[Stakeholders and Growth Strategy]]
7. [[Mission and Call to Action]]

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