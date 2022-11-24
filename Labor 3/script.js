const SUN_RADIUS_PROPORTION = 0.2;
const EARTH_RADIUS_PROPORTION = 0.25 * SUN_RADIUS_PROPORTION;
const MOON_RADIUS_PROPORTION = 0.25 * EARTH_RADIUS_PROPORTION
const EARTH_SUN_DISTANCE_PROPORTION_SCREEN = 0.4;
const MOON_EARTH_DISTANCE_PROPORTION_SCREEN = 0.1;
const canvas = document.getElementById('canvasElement');
const ctx = canvas.getContext('2d');
const yearSpan = document.getElementById('year');
const monthSpan = document.getElementById('month');
const daySpan = document.getElementById('day');
let interval;
let rid;
const stars = {
  coords: getStarPositions(),
  draw: function() {
    ctx.fillStyle = 'white';
    for (element of this.coords) {
      ctx.beginPath();
      ctx.arc(element[0], element[1], 1, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
}
const sun = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: canvas.width / 2 * SUN_RADIUS_PROPORTION,
  draw: function() {
    ctx.beginPath();
    let gradient = ctx.createRadialGradient(this.x, this.y, 5, this.x, this.y, this.radius);
    gradient.addColorStop(0, 'yellow');
    gradient.addColorStop(1, 'orange');
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
  }
}
const earth = {
  dr: (canvas.width / 2 - sun.radius) * EARTH_SUN_DISTANCE_PROPORTION_SCREEN + sun.radius,
  x: canvas.width / 2,
  y: canvas.height / 2,
  day: 0,
  radius: canvas.width / 2 * EARTH_RADIUS_PROPORTION,
  gradient: null,
  draw: function() {
    ctx.beginPath();
    if (this.gradient == null) {
      this.gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 20, canvas.width / 2, canvas.height / 2, canvas.width / 2);
      this.gradient.addColorStop(0.44, 'orange');
      this.gradient.addColorStop(0.52, 'blue');
    }
    let phi = (this.day % 365) / 365 * 2 * Math.PI;
    this.x = canvas.width / 2 + Math.cos(phi) * this.dr;
    this.y = canvas.height / 2 + Math.sin(phi) * this.dr;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.gradient;
    ctx.fill();
  }
}
const moon = {
  dr: (canvas.width / 2 - earth.dr - earth.radius) * MOON_EARTH_DISTANCE_PROPORTION_SCREEN + earth.radius,
  x: 0,
  y: 0,
  radius: canvas.width / 2 * MOON_RADIUS_PROPORTION,
  draw: function() {
    ctx.beginPath();
    let phi = (earth.day % 27) / 27 * 2 * Math.PI;
    this.x = earth.x + Math.cos(phi) * this.dr;
    this.y = earth.y + Math.sin(phi) * this.dr;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
  }
}
const moonShadow = {
  x: [earth.dr, earth.radius],
  y: [earth.dr, -earth.radius],
  z: getThirdPoint([0, sun.radius], [earth.dr, earth.radius]),
  earthTop: [earth.dr, earth.radius],
  earthBottom: [earth.dr, -earth.radius],
  radius: 0,
  draw: function() {
    ctx.save();
    ctx.translate(sun.x, sun.y)
    ctx.rotate((earth.day % 365) / 365 * 2 * Math.PI);
    ctx.beginPath();
    ctx.moveTo(this.x[0], this.x[1]);
    ctx.lineTo(this.y[0], this.y[1]);
    ctx.lineTo(this.z[0], this.z[1]);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fill();
    ctx.restore();
  }
}

document.getElementById('startButton').addEventListener('click', () => {
  interval = setInterval(() => {
    earth.day += 0.1;
    yearSpan.innerHTML = Math.floor(earth.day / 365);
    monthSpan.innerHTML = Math.floor((earth.day % 365) / (365 / 12));
    daySpan.innerHTML = Math.floor((earth.day % 365) % (365 / 12));
  }, 6000/365)
  draw();
})

document.getElementById('stopButton').addEventListener('click', () => {
  clearInterval(interval)
  window.cancelAnimationFrame(rid);
})

function draw() {
  //Aktuelles Canvas löschen und Ball zeichnen
  ctx.clearRect(0,0, canvas.width, canvas.height);
  stars.draw();
  sun.draw();
  moon.draw();
  moonShadow.draw();
  earth.draw();
  
  rid = window.requestAnimationFrame(draw);
}

function getThirdPoint(a, b) {
  const m = (a[1] - b[1]) / (a[0] - b[0]);
  const c = a[1];
  const x = (0 - c) / m;
  return [x, 0];
}

function getStarPositions() {
  const stars = [];
  for (let i = 0; i < 1000; i++) {
    stars.push([Math.random() * canvas.width, Math.random() * canvas.height]);
  }
  return stars;
}