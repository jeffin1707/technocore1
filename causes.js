const apiKey = 'DEMO_KEY'; // Replace with your NASA API Key
const url = https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${apiKey};
const canvas = document.getElementById('orbitCanvas');
const ctx = canvas.getContext('2d');
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

async function fetchCauses() {
  const res = await fetch(url);
  const data = await res.json();
  const asteroids = data.near_earth_objects;
  const container = document.getElementById('cause-cards');
  container.innerHTML = '';

  asteroids.slice(0, 10).forEach(asteroid => {
    const orbitEccentricity = asteroid.orbital_data?.eccentricity || 0;
    const inclination = asteroid.orbital_data?.inclination || 0;
    const velocity = parseFloat(asteroid.close_approach_data[0]?.relative_velocity.kilometers_per_second || 0);

    let cause = 'Stable orbit, low chance of fall.';
    if (orbitEccentricity > 0.5) cause = 'High eccentricity — elongated orbit increases Earth-crossing risk.';
    else if (inclination > 20) cause = 'Inclined orbit — gravitational perturbation by Jupiter likely.';
    else if (velocity > 20) cause = 'High velocity — possible resonance or slingshot effect.';
    else if (asteroid.is_potentially_hazardous_asteroid) cause = 'Potentially hazardous trajectory due to orbital resonance.';

    const card = document.createElement('div');
    card.className = 'cause-card';
    card.innerHTML = `
  <div class="cause-icon">☄</div>
  <h3>${asteroid.name}</h3>
      <p>Eccentricity: ${orbitEccentricity}</p>
      <p>Inclination: ${inclination}°</p>
      <p>Velocity: ${velocity.toFixed(2)} km/s</p>
      <p><strong>Cause:</strong> ${cause}</p>
    `;
    container.appendChild(card);
  });

  drawOrbits(asteroids);
}

function drawOrbits(asteroids) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
  ctx.fillStyle = '#0ff';
  ctx.fill(); // Earth

  asteroids.slice(0, 10).forEach((a, i) => {
    const r = 80 + i * 25;
    const angle = (i / 10) * Math.PI * 2;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
  });
}

fetchCauses();