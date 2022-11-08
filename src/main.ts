const canvas = document.querySelector("canvas")!;

function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
  // Lookup the size the browser is displaying the canvas in CSS pixels.
  const displayWidth  = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;

  // Check if the canvas is not the same size.
  const needResize = canvas.width  !== displayWidth ||
    canvas.height !== displayHeight;

  if (needResize) {
    // Make the canvas the same size
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }

  return needResize;
}

const gl = canvas.getContext("webgl2")!;

const vertexShaderSource = `#version 300 es
precision highp float;

uniform vec2 cameraCenter;
uniform float cameraSize;

in vec2 position;
out vec2 z0;

void main() {
  gl_Position = vec4(position, 0, 1);
  z0 = position * cameraSize / 2.0 + cameraCenter;
}`;

const fragmentShaderSource = `#version 300 es
precision highp float;

uniform vec2 c;
in vec2 z0;
out vec4 fragColor;

void main() {
  vec2 z = z0;
  for (int i = 0; i < 1000; i++) {
    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
  }
  fragColor = (dot(z, z) < 100.0) ? vec4(0, 0, 0, 1) : vec4(1, 1, 1, 1);
}`;

const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
  throw new Error(`Error occurred during vertex shader compilation: ${gl.getShaderInfoLog(vertexShader)}`)
}

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
  throw new Error(`Error occurred during fragment shader compilation: ${gl.getShaderInfoLog(fragmentShader)}`)
}

const shaderProgram = gl.createProgram()!;
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);

if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
  throw new Error(`Error occurred in linking: ${gl.getProgramInfoLog(shaderProgram)}`);
}

const positionLocation = gl.getAttribLocation(shaderProgram, "position");

const vertices = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const vao = gl.createVertexArray();
gl.bindVertexArray(vao);

gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

gl.useProgram(shaderProgram);

resizeCanvasToDisplaySize(gl.canvas);

gl.clearColor(0, 0, 0, 1);
gl.viewport(0, 0, canvas.width, canvas.height);

const cUniform = gl.getUniformLocation(shaderProgram, "c");

const cameraCenterUniform = gl.getUniformLocation(shaderProgram, "cameraCenter");
const cameraSizeUniform = gl.getUniformLocation(shaderProgram, "cameraSize");

let c = [0, 0];
let cameraCenter = [0, 0];
let cameraSize = 6;

gl.uniform2f(cUniform, c[0], c[1]);
gl.uniform2f(cameraCenterUniform, cameraCenter[0], cameraCenter[1]);
gl.uniform1f(cameraSizeUniform, cameraSize);

/*gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);*/

const v = 0.0005;

const pressed = {
  up: false,
  down: false,
  left: false,
  right: false,
  zoomIn: false,
  zoomOut: false,
  cUp: false,
  cDown: false,
  cLeft: false,
  cRight: false,
};

document.onkeydown = (e) => {
  switch (e.key) {
    case "w":
      pressed.up = true;
      break;
    case "s":
      pressed.down = true;
      break;
    case "a":
      pressed.left = true;
      break;
    case "d":
      pressed.right = true;
      break;
    case "q":
      pressed.zoomOut = true;
      break;
    case "e":
      pressed.zoomIn = true;
      break;
    case "ArrowUp":
      pressed.cUp = true;
      break;
    case "ArrowDown":
      pressed.cDown = true;
      break;
    case "ArrowLeft":
      pressed.cLeft = true;
      break;
    case "ArrowRight":
      pressed.cRight = true;
      break;
    default:
      console.log("Unknown key pressed:", e.key);
  }
};

document.onkeyup = (e) => {
  switch (e.key) {
    case "w":
      pressed.up = false;
      break;
    case "s":
      pressed.down = false;
      break;
    case "a":
      pressed.left = false;
      break;
    case "d":
      pressed.right = false;
      break;
    case "q":
      pressed.zoomOut = false;
      break;
    case "e":
      pressed.zoomIn = false;
      break;
    case "ArrowUp":
      pressed.cUp = false;
      break;
    case "ArrowDown":
      pressed.cDown = false;
      break;
    case "ArrowLeft":
      pressed.cLeft = false;
      break;
    case "ArrowRight":
      pressed.cRight = false;
      break;
    default:
      console.log("Unknown key pressed:", e.key);
  }
}

let tPrev = performance.now();
(function frame() {
  const t = performance.now();
  const dt = t - tPrev;
  tPrev = t;

  const zoomVelocity = (pressed.zoomOut ? -v : 0) + (pressed.zoomIn ? +v : 0);
  cameraSize += zoomVelocity * dt;
  const calculatedCameraSize = 6 * Math.exp(-cameraSize + 6);
  // console.log(cameraSize, calculatedCameraSize);

  const lateralVelocity = (pressed.left ? -v : 0) + (pressed.right ? +v : 0);
  const verticalVelocity = (pressed.down ? -v : 0) + (pressed.up ? +v : 0);

  cameraCenter[0] += lateralVelocity * dt * calculatedCameraSize;
  cameraCenter[1] += verticalVelocity * dt * calculatedCameraSize;

  const cLateralVelocity = (pressed.cLeft ? -v : 0) + (pressed.cRight ? +v : 0);
  const cVerticalVelocity = (pressed.cDown ? -v : 0) + (pressed.cUp ? +v : 0);
  c[0] += cLateralVelocity * dt * calculatedCameraSize;
  c[1] += cVerticalVelocity * dt * calculatedCameraSize;

  gl.uniform2f(cameraCenterUniform, cameraCenter[0], cameraCenter[1]);
  gl.uniform1f(cameraSizeUniform, calculatedCameraSize);
  gl.uniform2f(cUniform, c[0], c[1]);

  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  requestAnimationFrame(frame);
})();
