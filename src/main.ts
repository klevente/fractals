import { FragmentShader, VertexShader } from "./shader";
import { ShaderProgram } from "./shader-program";
import { resizeCanvasToDisplaySize } from "./util";
import { FullScreenQuad } from "./full-screen-quad";
import { Vec2 } from "./math";

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

const vertexShader = new VertexShader(gl, vertexShaderJuliaSource);
const fragmentShader = new FragmentShader(gl, fragmentShaderJuliaSource);
const program = new ShaderProgram(gl, vertexShader, fragmentShader);
const julia = new FullScreenQuad(gl, program);
const { uniforms } = julia;

resizeCanvasToDisplaySize(gl.canvas);

gl.clearColor(0, 0, 0, 1);
gl.viewport(0, 0, canvas.width, canvas.height);

let c = new Vec2()
let cameraCenter = new Vec2();
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

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

const movementVelocity = new Vec2();
const cVelocity = new Vec2();

let tPrev = performance.now();
(function frame() {
  julia.prime();
  const t = performance.now();
  const dt = t - tPrev;
  tPrev = t;

  const zoomVelocity = (pressed.zoomOut ? -v : 0) + (pressed.zoomIn ? +v : 0);
  cameraSize += zoomVelocity * dt;
  const calculatedCameraSize = 6 * Math.exp(-cameraSize + 6);
  // console.log(cameraSize, calculatedCameraSize);

  movementVelocity.set(
    (pressed.left ? -v : 0) + (pressed.right ? +v : 0),
    (pressed.down ? -v : 0) + (pressed.up ? +v : 0)
  );
  cameraCenter.addScaled(dt * calculatedCameraSize, movementVelocity);

  cVelocity.set(
    (pressed.cLeft ? -v : 0) + (pressed.cRight ? +v : 0),
    (pressed.cDown ? -v : 0) + (pressed.cUp ? +v : 0)
  );
  c.addScaled(dt * calculatedCameraSize, cVelocity);

  uniforms.c.setValue(c);
  uniforms.cameraCenter.setValue(cameraCenter);
  uniforms.cameraSize.setValue(calculatedCameraSize);

  julia.draw();
  requestAnimationFrame(frame);
})();
