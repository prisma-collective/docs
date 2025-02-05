# prisma

prisma is... 

- a [[process design collective]] 
- an [[action-learning]] framework 
- an incubator 

we facilitate [[action-learning journeys]] to [[place-source]] public goods infrastructure development so that [[bioregion|bioregional]] communities can participate more fully in pathways toward their [[life-affirming futures]].

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

# Contributor Metrics

<canvas id="contributionsChart"></canvas>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
fetch("contributions.json")
  .then(response => response.json())
  .then(data => {
    const ctx = document.getElementById('contributionsChart').getContext('2d');
    const chartData = {
      labels: data.map(entry => entry.user),
      datasets: [{
        label: 'Commits',
        data: data.map(entry => entry.commits),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    };
    new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
      }
    });
  });
</script>
