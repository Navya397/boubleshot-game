const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const COLORS = ['red', 'green', 'blue', 'yellow', 'purple'];
const bubbles = [];
let shooter = createShooter();

function createShooter() {
  return createBubble(canvas.width / 2, canvas.height - 30);
}

function createBubble(x, y, angle = 0) {
  const speed = 5;
  return {
    x,
    y,
    radius: 15,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    dx: speed * Math.cos(angle),
    dy: speed * Math.sin(angle)
  };
}

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const targetX = e.clientX - rect.left;
  const targetY = e.clientY - rect.top;

  const angle = Math.atan2(targetY - shooter.y, targetX - shooter.x);

  const shot = createBubble(shooter.x, shooter.y, angle);
  bubbles.push(shot);

  shooter = createShooter(); // ready next bubble
});

function drawBubble(bubble) {
  ctx.beginPath();
  ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
  ctx.fillStyle = bubble.color;
  ctx.fill();
  ctx.closePath();
}

function detectMatch() {
  for (let i = 0; i < bubbles.length; i++) {
    for (let j = i + 1; j < bubbles.length; j++) {
      const dx = bubbles[i].x - bubbles[j].x;
      const dy = bubbles[i].y - bubbles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 30 && bubbles[i].color === bubbles[j].color) {
        bubbles.splice(j, 1);
        bubbles.splice(i, 1);
        return;
      }
    }
  }
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < bubbles.length; i++) {
    const b = bubbles[i];
    b.x += b.dx;
    b.y += b.dy;

    // Bounce from side walls
    if (b.x < b.radius || b.x > canvas.width - b.radius) {
      b.dx *= -1;
    }

    // Stop at top
    if (b.y < b.radius) {
      b.dy = 0;
      b.dx = 0;
    }

    drawBubble(b);
  }

  drawBubble(shooter);

  detectMatch();

  requestAnimationFrame(update);
}

update();
