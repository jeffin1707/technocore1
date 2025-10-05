const apiKey = 'DEMO_KEY'; // Replace with your NASA API Key
const url = https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${apiKey};

const canvas = document.getElementById('asteroid-radar');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
const centerX = width / 2;
const centerY = height / 2;

let asteroidsData = [];

async function fetchAsteroids() {
    const res = await fetch(url);
    const data = await res.json();
    const asteroids = data.near_earth_objects;

    const container = document.getElementById('asteroid-cards');
    container.innerHTML = '';

    asteroidsData = []; // Reset radar data

    asteroids.forEach(asteroid => {
        // Display cards
        const card = document.createElement('div');
        card.className = 'asteroid-card';
        card.innerHTML = `
            <h3>${asteroid.name}</h3>
            <p>Size: ${asteroid.estimated_diameter.meters.estimated_diameter_max.toFixed(2)} m</p>
            <p>Potential Hazard: ${asteroid.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}</p>
            <p>Distance: ${asteroid.close_approach_data[0]?.miss_distance.kilometers} km</p>
        `;
        container.appendChild(card);

        // Store radar data
        if (asteroid.close_approach_data.length > 0) {
            asteroidsData.push({
                name: asteroid.name,
                distance: parseFloat(asteroid.close_approach_data[0].miss_distance.kilometers),
                velocity: parseFloat(asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour)
            });
        }
    });

    drawRadar();
}

function drawRadar() {
    ctx.clearRect(0, 0, width, height);

    // Draw Earth (center)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#0ff';
    ctx.fill();
    ctx.closePath();

    // Draw radar rings
    for (let r = 100; r <= 250; r += 50) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0,255,255,0.2)';
        ctx.stroke();
        ctx.closePath();
    }

    // Draw asteroids
    asteroidsData.forEach((asteroid, index) => {
        const angle = (index / asteroidsData.length) * Math.PI * 2;
        // Scale distance to radar (max distance ~250, adjust as needed)
        const distance = Math.min(250, asteroid.distance / 100000); // scale for visualization
        const x = centerX + distance * Math.cos(angle);
        const y = centerY + distance * Math.sin(angle);

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = asteroid.distance < 500000 ? '#ff0000' : '#fff'; // red if very close
        ctx.fill();
        ctx.closePath();

        // Asteroid name label
        ctx.fillStyle = '#0ff';
        ctx.font = '10px Orbitron';
        ctx.fillText(asteroid.name, x + 8, y + 4);
    });
}

// Initial fetch
fetchAsteroids();