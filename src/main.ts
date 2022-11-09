import { FragmentShader, VertexShader } from "./shader";
import { ShaderProgram } from "./shader-program";
import { resizeCanvasToDisplaySize } from "./util";
import { QuadRenderer } from "./quad-renderer";

const canvas = document.querySelector("canvas")!;
const gl = canvas.getContext("webgl2")!;

const vertexShaderJuliaSource = `#version 300 es
precision highp float;

uniform vec2 cameraCenter;
uniform float cameraSize;

in vec2 position;
out vec2 z0;

void main() {
  gl_Position = vec4(position, 0, 1);
  z0 = position * cameraSize / 2.0 + cameraCenter;
}`;

const fragmentShaderJuliaSource = `#version 300 es
precision highp float;

uniform vec2 c;
in vec2 z0;
out vec4 fragColor;

void main() {
  vec2 z = z0;
  for (int i = 0; i < 100; i++) {
    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
  }
  fragColor = (dot(z, z) < 100.0) ? vec4(0, 0, 0, 1) : vec4(1, 1, 1, 1);
}`;

const fragmentShaderMandelbrotSource = `#version 300 es
precision highp float;

in vec2 z0;
out vec4 fragColor;

void main() {
  vec2 z = z0;
  for (int i = 0; i < 100; i++) {
    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + z0;
  }
  fragColor = (dot(z, z) < 100.0) ? vec4(0, 0, 0, 1) : vec4(1, 1, 1, 1);
}`;

console.log(fragmentShaderMandelbrotSource);

const vertexShader = new VertexShader(gl, vertexShaderJuliaSource);
const fragmentShader = new FragmentShader(gl, fragmentShaderJuliaSource);
const program = new ShaderProgram(gl, vertexShader, fragmentShader);
const juliaRenderer = new QuadRenderer(gl, program);
const { uniforms } = juliaRenderer;

resizeCanvasToDisplaySize(gl.canvas);

gl.clearColor(0, 0, 0, 1);
gl.viewport(0, 0, canvas.width, canvas.height);

let c = [0, 0];
let cameraCenter = [0, 0];
let cameraSize = 6;

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
  juliaRenderer.prime();
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

  juliaRenderer.setUniform(uniforms.c, c);
  juliaRenderer.setUniform(uniforms.cameraCenter, cameraCenter);
  juliaRenderer.setUniform(uniforms.cameraSize, calculatedCameraSize);

  juliaRenderer.draw();
  requestAnimationFrame(frame);
})();
