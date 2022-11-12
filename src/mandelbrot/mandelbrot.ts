import { FragmentShader, VertexShader } from "../shader";
import { ShaderProgram } from "../shader-program";
import { QuadRenderer } from "../quad-renderer";
import { resizeCanvasToDisplaySize } from "../util";

const canvas = document.querySelector("canvas")!;
const gl = canvas.getContext("webgl2")!;

const vertexShaderMandelbrotSource = `#version 300 es
precision highp float;

uniform vec2 cameraCenter;
uniform float cameraSize;

in vec2 position;
out vec2 z0;

void main() {
  gl_Position = vec4(position, 0, 1);
  z0 = position * cameraSize / 2.0 + cameraCenter;
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

const vertexShader = new VertexShader(gl, vertexShaderMandelbrotSource);
const fragmentShader = new FragmentShader(gl, fragmentShaderMandelbrotSource);
const program = new ShaderProgram(gl, vertexShader, fragmentShader);
const mandelbrotRenderer = new QuadRenderer(gl, program);
const { uniforms } = mandelbrotRenderer;

resizeCanvasToDisplaySize(gl.canvas);

gl.clearColor(1, 0, 0, 1);
gl.viewport(0, 0, canvas.width, canvas.height);

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
};

function handleKeyDown(e: KeyboardEvent) {
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
    default:
      console.log("Unknown key pressed:", e.key);
  }
}

function handleKeyUp(e: KeyboardEvent) {
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
    default:
      console.log("Unknown key pressed:", e.key);
  }
}

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

let tPrev = performance.now();
(function frame() {
  mandelbrotRenderer.prime();
  const t = performance.now();
  const dt = t - tPrev;
  tPrev = t;

  const zoomVelocity = (pressed.zoomOut ? -v : 0) + (pressed.zoomIn ? +v : 0);
  cameraSize += zoomVelocity * dt;
  const calculatedCameraSize = 6 * Math.exp(-cameraSize + 6);

  const lateralVelocity = (pressed.left ? -v : 0) + (pressed.right ? +v : 0);
  const verticalVelocity = (pressed.down ? -v : 0) + (pressed.up ? +v : 0);

  cameraCenter[0] += lateralVelocity * dt * calculatedCameraSize;
  cameraCenter[1] += verticalVelocity * dt * calculatedCameraSize;

  mandelbrotRenderer.setUniform(uniforms.cameraCenter, cameraCenter);
  mandelbrotRenderer.setUniform(uniforms.cameraSize, calculatedCameraSize);

  mandelbrotRenderer.draw();

  requestAnimationFrame(frame);
})();
