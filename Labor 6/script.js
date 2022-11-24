const canvas = document.getElementById('canvasElement');
const ctx = canvas.getContext('2d');
const button = document.getElementById('fillButton');
const lineColor = document.getElementById('color');
const lineWidth = document.getElementById('width');
const rectSize = 500;
let tempCoordinates = [];
let currentCoordinates = [];

function drawSquare() {
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // set background color white
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // draw square
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(rectSize, 0);
  ctx.lineTo(rectSize, rectSize);
  ctx.lineTo(0, rectSize);
  ctx.closePath();
  ctx.stroke();
}

function drawPolygon(coordinates) {
  let color = lineColor.value;
  let width = Number(lineWidth.value);

  drawSquare();
  ctx.save();
  // set line color and width
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(coordinates[0][0], coordinates[0][1]);
  for (let i = 1; i < coordinates.length; i++) {
    ctx.lineTo(coordinates[i][0], coordinates[i][1]);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function scanLine() {
  drawPolygon(currentCoordinates)
  // copy currentCoordinates to tempCoordinates
  let coordinates = currentCoordinates.slice();
  coordinates.push(currentCoordinates[0]);
  // [x, ymax, x, ymin, m]  
  let edges = [];
  for (let i = 0; i < coordinates.length - 1; i++) {
    let p1 = coordinates[i];
    let p2 = coordinates[i + 1];
    // make shure yp1 > yp2
    if (p1[1] < p2[1]) {
      // switch p1 and p2
      let temp = p1;
      p1 = p2;
      p2 = temp;
    }
    const m = (p2[0] - p1[0]) / (p2[1] - p1[1]);
    edges.push([p1[0], p1[1], p2[0], p2[1], m]);
  }
  // sort edges by ymax, if ymax is equal, sort by ymin
  edges.sort((a, b) => {
    if (a[1] === b[1]) {
      return b[3] - a[3];
    }
    return b[1] - a[1];
  })

  let y1 = edges[0][1];
  // loop through all y levels
  for (let i = y1; i > 0; i--) {
    // get all edges that intersect with current y level
    let activeEdges = edges.filter(edge => edge[1] >= i && edge[3] <= i);
    // array for doubled x values
    let xValues = [];
    // get intersections
    for (let j = 0; j < activeEdges.length; j++) {
      if (i === activeEdges[j][1]) {
        // vertex max
        if (activeEdges.filter(aEdge => aEdge[0] === activeEdges[j][0]).length % 2 === 1) {
          // only push if unique
          if (xValues.indexOf(activeEdges[j][0]) === -1) {
            xValues.push(activeEdges[j][0]);
          }
        }
      } else if (i === activeEdges[j][3]) {
        // vertex min
        if (activeEdges.filter(aEdge => aEdge[2] === activeEdges[j][2]).length % 2 === 1) {
          // only push if unique
          if (xValues.indexOf(activeEdges[j][2]) === -1) {
            xValues.push(activeEdges[j][2]);
          }
        }
      } else {
        let x = activeEdges[j][0] + (i - activeEdges[j][1]) * activeEdges[j][4];
        xValues.push(x);
      }
    }
   
    // sort x values
    xValues.sort((a, b) => a - b);
    for (let j = 0; j < xValues.length / 2; j++) {
      // set line color
      ctx.strokeStyle = lineColor.value;
      ctx.beginPath();
      ctx.moveTo(xValues[j * 2], i);
      ctx.lineTo(xValues[j * 2 + 1], i);
      ctx.stroke();
    }
  }
}

// add eventlistener for left mouse button
canvas.addEventListener('mousedown', function (event) {
  event.preventDefault();
  // check for left click
  if (event.button == 0) {
    // get mouse coordinates
    let x = Math.round((event.clientX - canvas.offsetLeft) / canvas.clientWidth * canvas.width);
    let y = Math.round((event.clientY - canvas.offsetTop) / canvas.clientHeight * canvas.height);
    tempCoordinates.push([x, y]);
  }
})

// add eventlistener for right mouse button
canvas.addEventListener('contextmenu', function (event) {
  event.preventDefault();
  // check for right click
  if (event.button == 2) {
    // get mouse coordinates
    currentCoordinates = tempCoordinates;
    tempCoordinates = [];
    drawPolygon(currentCoordinates);
  }
})

button.addEventListener('click', function () {
  scanLine();
})

window.onload = function () {
  drawSquare();
}