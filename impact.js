const apiKey = 'DEMO_KEY'; // Replace with your NASA API Key
const url = https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${apiKey};

async function fetchImpactData() {
  const res = await fetch(url);
  const data = await res.json();
  const asteroids = data.near_earth_objects;
  const container = document.getElementById('impact-cards');
  container.innerHTML = '';

  asteroids.forEach(asteroid => {
    const diameter = asteroid.estimated_diameter.meters.estimated_diameter_max;
    const radius = diameter / 2;
    const density = 3000; // kg/m³
    const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
    const mass = density * volume; // kg

    const velocity = parseFloat(asteroid.close_approach_data[0]?.relative_velocity.kilometers_per_second || 0);
    const energyJoules = 0.5 * mass * Math.pow(velocity * 1000, 2); // J
    const energyTNT = energyJoules / 4.184e9; // tons of TNT

    const card = document.createElement('div');
    card.className = 'impact-card';
    card.innerHTML = `
      <h3>${asteroid.name}</h3>
      <p>Size: ${diameter.toFixed(2)} m</p>
      <p>Velocity: ${velocity.toFixed(2)} km/s</p>
      <p>Impact Energy: ${energyTNT.toExponential(2)} tons TNT</p>
      <p>Hazard: ${asteroid.is_potentially_hazardous_asteroid ? '⚠ Yes' : '✅ No'}</p>
    `;
    container.appendChild(card);
  });
}

fetchImpactData();