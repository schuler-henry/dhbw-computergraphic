const canvas = document.getElementById('canvasElement');
const ctx = canvas.getContext('2d');
const button = document.getElementById('clipButton');
const lineColor = document.getElementById('color');
const lineWidth = document.getElementById('width');
const rectSize = 150;
let x1, y1, x2, y2;
// set curser to center of canvas
ctx.translate(canvas.width / 2, canvas.height / 2);

function drawSquare() {
  // clear canvas
  ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
  // set background color white
  ctx.fillStyle = 'white';
  ctx.fillRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
  // draw square
  ctx.beginPath();
  ctx.moveTo(-rectSize, -rectSize);
  ctx.lineTo(rectSize, -rectSize);
  ctx.lineTo(rectSize, rectSize);
  ctx.lineTo(-rectSize, rectSize);
  ctx.closePath();
  ctx.stroke();
}

function drawLine(x1, y1, x2, y2) {
  let color = lineColor.value;
  let width = Number(lineWidth.value);

  drawSquare();
  ctx.save();
  // set line color and width
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.restore();
}

function getRegion(x, y) {
  let region = 0b0000;
  if (x < -rectSize) region |= 0b0001;
  else if (x > rectSize) region |= 0b0010;
  if (y < -rectSize) region |= 0b0100;
  else if (y > rectSize) region |= 0b1000;
  return region;
}

function getIntersectionPoint(x, y, r, m, c) {
  let x0, y0;

  if ((r | 0b0000) == 0) {
    // inside
    console.log('original')
    return [x, y];
  }
  if (r & 0b1000) {
    // top
    y0 = rectSize;
    x0 = (y0 - c) / m;
    // return only if point on square
    if (Math.abs(x0) < rectSize) {
      console.log('top')
      return [x0, y0];
    }
  }
  if(r & 0b0100) {
    // bottom
    y0 = -rectSize;
    x0 = (y0 - c) / m;
    // return only if point on square
    if (Math.abs(x0) < rectSize) {
      console.log('bottom')
      return [x0, y0];
    }
  }
  if (r & 0b0001) {
    // left
    x0 = -rectSize;
    y0 = m * x0 + c;
    // return only if point on square
    if (Math.abs(y0) < rectSize) {
      console.log('left')
      return [x0, y0];
    }
  }
  if (r & 0b0010) {
    // right
    x0 = rectSize;
    y0 = m * x0 + c;
    // return only if point on square
    if (Math.abs(y0) < rectSize) {
      console.log('right')
      return [x0, y0];
    }
  }

  // if no intersection point found, return original point
  // this point should never be reached
  console.log('fallback')
  return [x, y];
}

function CohenSutherland(x1, y1, x2, y2) {
  r1 = getRegion(x1, y1);
  r2 = getRegion(x2, y2);

  console.log(r1, r2)

  drawSquare();

  if ((r1 | r2) == 0) {
    // line inside
    drawLine(x1, y1, x2, y2);
  } else if ((r1 & r2) != 0) {
    // line outside
    return;
  } else {
    // get intersection point
    const dx = x2 - x1;
    const dy = y2 - y1;
    const m = dy / dx
    const c = y1 - m * x1;

    s1 = getIntersectionPoint(x1, y1, r1, m, c);
    s2 = getIntersectionPoint(x2, y2, r2, m, c);

    console.log(s1, s2)

    console.log(getRegion(s1[0], s1[1]), getRegion(s2[0], s2[1]))

    rs1 = getRegion(s1[0], s1[1]);
    rs2 = getRegion(s2[0], s2[1]);

    if ((rs1 | rs2) == 0) {
      drawLine(s1[0], s1[1], s2[0], s2[1]);
    }
  }
  

}

// add eventlistener for left mouse button
canvas.addEventListener('mousedown', function (event) {
  // get mouse coordinates
  x1 = (event.clientX - canvas.offsetLeft) / canvas.clientWidth * canvas.width - canvas.width / 2;
  y1 = (event.clientY - canvas.offsetTop) / canvas.clientHeight * canvas.height - canvas.height / 2;
})

canvas.addEventListener('mouseup', function (event) {
  // get mouse coordinates
  x2 = (event.clientX - canvas.offsetLeft) / canvas.clientWidth * canvas.width - canvas.width / 2;
  y2 = (event.clientY - canvas.offsetTop) / canvas.clientHeight * canvas.height - canvas.height / 2;
  drawLine(x1, y1, x2, y2);
})

button.addEventListener('click', function (event) {
  console.log('click');
  CohenSutherland(x1, y1, x2, y2);
})

drawSquare();