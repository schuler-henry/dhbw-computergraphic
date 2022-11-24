const canvas = document.getElementById('canvasElement');
const ctx = canvas.getContext('2d');
const drawButton = document.getElementById('drawLine');
// set curser to center of canvas
ctx.translate(canvas.width / 2, canvas.height / 2);

function drawCoordinates() {
  // clear canvas
  ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
  // draw x axis
  ctx.beginPath();
  ctx.moveTo(-canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, 0);
  ctx.stroke();
  // print x axis label with font size 20
  ctx.font = '20px Arial';
  ctx.fillText('x', canvas.width / 2 - 15, 15);
  // draw y axis
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(0, -canvas.height / 2);
  ctx.stroke();
  // print y axis label with font size 20
  ctx.font = '20px Arial';
  ctx.fillText('y', -15, -canvas.height / 2 + 15);
}

function bresenham(x0, y0, x1, y1) {
  // calculate dx and dy
  let dx = Math.abs(x1 - x0);
  let dy = Math.abs(y1 - y0);
  // calculate sx and sy
  let sx = (x0 < x1) ? 1 : -1;
  let sy = (y0 < y1) ? 1 : -1;
  // calculate error
  let err = dx - dy;
  // draw first point
  ctx.fillRect(x0, y0, 1, 1);
  // loop
  while (!((x0 == x1) && (y0 == y1))) {
    // calculate e2
    let e2 = 2 * err;
    // if e2 > -dy then error -= dy and x0 += sx
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    // if e2 < dx then error += dx and y0 += sy 
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
    // draw point
    ctx.fillRect(x0, y0, 1, 1);
  }
}

// EXECUTE /////////////////////////////////////////////////////////////////////

drawCoordinates();

drawButton.addEventListener('click', () => {
  // get all input values as numbers
  const x1 = Number(document.getElementById('startX').value);
  const y1 = -Number(document.getElementById('startY').value);
  const x2 = Number(document.getElementById('endX').value);
  const y2 = -Number(document.getElementById('endY').value);
  
  console.log(x1, y1, x2, y2);

  drawCoordinates();

  bresenham(x1, y1, x2, y2);
})
