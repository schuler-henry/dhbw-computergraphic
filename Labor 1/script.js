const c = document.getElementById("drawing");
const ctx = c.getContext("2d");
const x = c.width / 2;

// Draw border with 1px width
ctx.lineWidth = 7;
ctx.strokeStyle = "black";
ctx.fillStyle = "white";
ctx.fillRect(0, 0, c.width, c.height);
ctx.strokeRect(0, 0, c.width, c.height);

ctx.font = "bold 18px Roboto";
ctx.textAlign = "center";
ctx.fillStyle = "green";
ctx.fillText("My first Canvas 2D Drawing", x, 30);

// draw house
// body
ctx.beginPath();
ctx.rect(80, 150, 140, 100);
ctx.stroke();

// roof
let pathRoof = new Path2D();
pathRoof.moveTo(60, 150);
pathRoof.lineTo(240, 150);
pathRoof.lineTo(150, 80);
pathRoof.closePath();
ctx.stroke(pathRoof);

// door
ctx.beginPath();
ctx.fillStyle = "red";
ctx.fillRect(135, 200, 30, 50);
ctx.lineWidth = 3;
ctx.strokeRect(135, 200, 30, 50);

ctx.fillStyle = "white";
ctx.fillRect(146, 217, 8, 16);

// window
ctx.beginPath();
ctx.strokeRect(175, 170, 30, 20);

// car
let pathCar = new Path2D();
pathCar.moveTo(155, 305);
pathCar.lineTo(155, 275);
pathCar.lineTo(185, 275);
pathCar.lineTo(205, 255);
pathCar.lineTo(265, 260);
pathCar.bezierCurveTo(280, 260, 290, 275, 290, 285);
pathCar.lineTo(290, 305);
pathCar.lineTo(270, 305);
pathCar.bezierCurveTo(260, 325, 250, 305, 250, 305);
pathCar.lineTo(200, 305);
pathCar.bezierCurveTo(190, 325, 180, 305, 180, 305);
pathCar.lineTo(155, 305);
pathCar.closePath();
ctx.lineWidth = 3;
ctx.strokeStyle = "blue";
ctx.fillStyle = "lightblue";
ctx.fill(pathCar);
ctx.stroke(pathCar);

// tree
ctx.fillStyle = "brown";
ctx.fillRect(290, 200, 10, 50);
// 295
let pathTreeTop = new Path2D();
pathTreeTop.moveTo(280, 198);
pathTreeTop.bezierCurveTo(290, 205, 300, 205, 310, 198);
pathTreeTop.bezierCurveTo(335, 195, 335, 165, 315, 160);
pathTreeTop.bezierCurveTo(305, 140, 285, 140, 275, 160);
pathTreeTop.bezierCurveTo(255, 165, 255, 195, 280, 198)
pathTreeTop.closePath();
ctx.fillStyle = "green";
ctx.fill(pathTreeTop);
