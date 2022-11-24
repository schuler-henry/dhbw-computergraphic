const mat4 = glMatrix.mat4;
let xRotation = 0.0;
let yRotation = 0.0;
let zRotation = 0.0;

function main() {
  const canvas = document.querySelector("#canvasElement");
  // Initialize the GL context
  const gl = canvas.getContext("webgl2");
  
  // Only continue if WebGL is available and working
  if (gl === null) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
  }
  
  // Set clear color to black, fully opaque (backup if background image fails)
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Vertex shader program
  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    attribute vec2 aTextureCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;
    varying highp vec2 vTextureCoord;

    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
      vTextureCoord = aTextureCoord;
    }
  `;

  // Fragment shader program
  const fsSource = `
    varying lowp vec4 vColor;
    varying highp vec2 vTextureCoord;

    uniform sampler2D uSampler;
    
    void main() {
      gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor;
    }
  `;

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
    },
  };

  // load textures
  const backgroundTexture = loadTexture(gl, 'background.png', true);
  const cubeTexture = loadTexture(gl, 'bricks.png');
  // flip the image
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  let then = 0;

  // Draw the scene repeatedly
  function render(now) {
    now *= 0.1;
    const deltaTime = now - then;
    then = now;
    
    drawScene(gl, programInfo, [cubeBuffers(gl), backgroundBuffers(gl)], [cubeTexture, backgroundTexture]);
    // apply rotation
    xRotation = 90;
    // xRotation += deltaTime;
    // yRotation += deltaTime * .7;
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

// initial start point
window.onload = main;

// HELPER FUNCTIONS

//
// Initialize a shader program, so WebGL knows how to draw the data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and compiles it.
//
function loadShader(gl, type, source) { 
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function backgroundBuffers(gl) {
  // set positions
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = [
    -3.5, -3.5,  -2.0,
     3.5, -3.5,  -2.0,
     3.5,  3.5,  -2.0,
    -3.5,  3.5,  -2.0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  // set colors
  const faceColors = [
    [1.0,  1.0,  1.0,  1.0],    // Front face: white
  ];
  let colors = [];
  for (var j = 0; j < faceColors.length; ++j) {
    const c = faceColors[j];
    colors = colors.concat(c, c, c, c);
  }
  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  // set texture coordinates
  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
  const textureCoordinates = [
    // Front
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
  // set indices for the triangles
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  const indices = [
    0,  1,  2,      0,  2,  3,    // front
  ];
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    color: colorBuffer,
    textureCoord: textureCoordBuffer,
    indices: indexBuffer,
  };
}

function cubeBuffers(gl) {
  // set positions
  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now create an array of positions for the square.

  const positions = [
    // Front face
    -0.5, -0.5,  0.5,
     0.5, -0.5,  0.5,
     0.5,  0.5,  0.5,
    -0.5,  0.5,  0.5,
  
    // Back face
    -0.5, -0.5, -0.5,
    -0.5,  0.5, -0.5,
     0.5,  0.5, -0.5,
     0.5, -0.5, -0.5,
  
    // Top face
    -0.5,  0.5, -0.5,
    -0.5,  0.5,  0.5,
     0.5,  0.5,  0.5,
     0.5,  0.5, -0.5,
  
    // Bottom face
    -0.5, -0.5, -0.5,
     0.5, -0.5, -0.5,
     0.5, -0.5,  0.5,
    -0.5, -0.5,  0.5,
  
    // Right face
     0.5, -0.5, -0.5,
     0.5,  0.5, -0.5,
     0.5,  0.5,  0.5,
     0.5, -0.5,  0.5,
  
    // Left face
    -0.5, -0.5, -0.5,
    -0.5, -0.5,  0.5,
    -0.5,  0.5,  0.5,
    -0.5,  0.5, -0.5,
  ];

  // rotate positions by phi degrees around the x axis
  // deg to rad
  const phi = xRotation * Math.PI / 180.0;
  const c = Math.cos(phi);
  const s = Math.sin(phi);
  for (var i = 0; i < positions.length; i += 3) {
    const y = positions[i + 1];
    const z = positions[i + 2];
    positions[i + 1] = y * c - z * s;
    positions[i + 2] = y * s + z * c;
  }
  // rotate positions by theta degrees around the local y axis
  // deg to rad
  const theta = yRotation * Math.PI / 180.0;
  const c2 = Math.cos(theta);
  const s2 = Math.sin(theta);
  for (var i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const z = positions[i + 2];
    positions[i] = x * c2 - z * s2;
    positions[i + 2] = x * s2 + z * c2;
  }
  // rotate positions by psi degrees around the z axis
  // deg to rad
  const psi = zRotation * Math.PI / 180.0;
  const c3 = Math.cos(psi);
  const s3 = Math.sin(psi);
  for (var i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    positions[i] = x * c3 - y * s3;
    positions[i + 1] = x * s3 + y * c3;
  }

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const faceColors = [
    [0.1,  0.1,  0.1,  1.0],    // Front face: almost black
    [1.0,  0.0,  0.0,  1.0],    // Back face: red
    [0.0,  1.0,  0.0,  1.0],    // Top face: green
    [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
    [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
    [1.0,  0.0,  1.0,  1.0],    // Left face: purple
  ];

  // Convert the array of colors into a table for all the vertices.

  var colors = [];

  for (var j = 0; j < faceColors.length; ++j) {
    const c = faceColors[j];
    // Repeat each color four times for the four vertices of the face
    colors = colors.concat(c, c, c, c);
  }

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

  const textureCoordinates = [
    // Front
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Back
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Top
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Bottom
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Right
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Left
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                gl.STATIC_DRAW);


  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  const indices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
  ];

  // Now send the element array to GL

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices), gl.STATIC_DRAW);


  return {
    position: positionBuffer,
    color: colorBuffer,
    textureCoord: textureCoordBuffer,
    indices: indexBuffer,
  };
}

function drawScene(gl, programInfo, bufferArray, texture) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 [-0.0, 0.0, -6.0]);  // amount to translate

  for (let i = 0; i < bufferArray.length; i++) {
    const buffers = bufferArray[i];
    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    {
      const numComponents = 3;  // pull out 3 values per iteration
      const type = gl.FLOAT;    // the data in the buffer is 32bit floats
      const normalize = false;  // don't normalize
      const stride = 0;         // how many bytes to get from one set of values to the next
                                // 0 = use type and numComponents above
      const offset = 0;         // how many bytes inside the buffer to start from
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
      gl.vertexAttribPointer(
          programInfo.attribLocations.vertexPosition,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(
          programInfo.attribLocations.vertexPosition);
    }
    {
      const numComponents = 4;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
      gl.vertexAttribPointer(
          programInfo.attribLocations.vertexColor,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(
          programInfo.attribLocations.vertexColor);
      
      
    }
    // tell webgl how to pull out the texture coordinates from buffer
    {
      const num = 2; // every coordinate composed of 2 values
      const type = gl.FLOAT; // the data in the buffer is 32-bit float
      const normalize = false; // don't normalize
      const stride = 0; // how many bytes to get from one set to the next
      const offset = 0; // how many bytes inside the buffer to start from
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
      gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, num, type, normalize, stride, offset);
      gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    // Tell WebGL to use our program when drawing

    gl.useProgram(programInfo.program);

    // Set the shader uniforms

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);

    // Tell WebGL we want to affect texture unit 0
    gl.activeTexture(gl.TEXTURE0);

    // Bind the texture to texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, texture[i]);

    // Tell the shader we bound the texture to texture unit 0
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

    {
      const offset = 0;
      const vertexCount = i === 0 ? 36 : 6;
      const type = gl.UNSIGNED_SHORT;
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
  }
}

//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(gl, url, useColor = false) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be downloaded over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = useColor ? gl.RGBA : gl.LUMINANCE_ALPHA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = useColor ? gl.RGBA : gl.LUMINANCE_ALPHA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);

  const image = new Image();
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, image);

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       // Yes, it's a power of 2. Generate mips.
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       // No, it's not a power of 2. Turn off mips and set
       // wrapping to clamp to edge
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;

  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) === 0;
}