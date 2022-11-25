import { FragmentShader, VertexShader } from "../shader";
import { ShaderProgram } from "../shader-program";
import { FullScreenQuad } from "../full-screen-quad";
import { resizeCanvasToDisplaySize } from "../util";
import { Vec2 } from "../math";

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

const int maxIterations = 100;

const uint BlackAndWhite = 1u;
const uint WhiteAndBlack = 2u;
const uint GrayScale = 3u;
const uint InverseGrayScale = 4u;
const uint Hsl = 5u;
const uint Rgb = 6u;

uniform uint coloringType;

in vec2 z0;
out vec4 fragColor;

float hue2rgb(float p, float q, float t) {
  t = fract(t);
  if (t < 1.0 / 6.0) return p + (q - p) * 6.0 * t;
  if (t < 1.0 / 2.0) return q;
  if (t < 2.0 / 3.0) return p + (q - p) * (2.0 / 3.0 - t) * 6.0;
  return p;
}

vec3 hsl2rgb(float h, float s, float l) {
  if (s == 0.0) return vec3(l, l, l);

  float q = l < 0.5 ? l * (1.0 + s) : l + s - l * s;
  float p = 2.0 * l - q;

  float r = hue2rgb(p, q, h + 1.0 / 3.0);
  float g = hue2rgb(p, q, h);
  float b = hue2rgb(p, q, h - 1.0 / 3.0);

  return vec3(r, g, b);
}

vec4 calcColor(int iterations) {
  switch (coloringType) {
  case BlackAndWhite: {
    return iterations < 100 ? vec4(1, 1, 1, 1): vec4(0, 0, 0, 1);
  }
  case WhiteAndBlack: {
    return iterations < 100 ? vec4(0, 0, 0, 1): vec4(1, 1, 1, 1);
  }
  case GrayScale: {
    float color = float(iterations) / float(maxIterations);
    return vec4(color, color, color, 1);
  }
  case InverseGrayScale: {
    float color = 1.0 - float(iterations) / float(maxIterations);
    return vec4(color, color, color, 1);
  }
  case Hsl: {
    float color = float(iterations) / float(maxIterations);
    vec3 rgb = hsl2rgb(color, 0.9, .5);
    return vec4(rgb, 1);
  }
  case Rgb: {
    float color = float(iterations) / float(maxIterations);
    vec3 ambient = vec3(.3, .8, .5);
    vec3 rgb = vec3(fract(color + ambient.x), fract(color + ambient.y), fract(color + ambient.z));
    return vec4(rgb, 1);
  }
  }
}

void main() {
  vec2 z = z0;
  int iterations = 0;
  while (iterations < maxIterations && dot(z, z) < 4.0) {
    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + z0;
    iterations++;
  }
  fragColor = calcColor(iterations);
}`;

const vertexShader = new VertexShader(gl, vertexShaderMandelbrotSource);
const fragmentShader = new FragmentShader(gl, fragmentShaderMandelbrotSource);
const program = new ShaderProgram(gl, vertexShader, fragmentShader);
const mandelbrot = new FullScreenQuad(gl, program);
const { uniforms } = mandelbrot;

resizeCanvasToDisplaySize(gl.canvas);

gl.clearColor(1, 0, 0, 1);
gl.viewport(0, 0, canvas.width, canvas.height);

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

const movementVelocity = new Vec2();

let tPrev = performance.now();
(function frame() {
  mandelbrot.prime();
  const t = performance.now();
  const dt = t - tPrev;
  tPrev = t;

  const zoomVelocity = (pressed.zoomOut ? -v : 0) + (pressed.zoomIn ? +v : 0);
  cameraSize += zoomVelocity * dt;
  const calculatedCameraSize = 6 * Math.exp(-cameraSize + 6);

  movementVelocity.set(
    (pressed.left ? -v : 0) + (pressed.right ? +v : 0),
    (pressed.down ? -v : 0) + (pressed.up ? +v : 0)
  );
  cameraCenter.addScaled(dt * calculatedCameraSize, movementVelocity);

  uniforms.cameraCenter.setValue(cameraCenter);
  uniforms.cameraSize.setValue(calculatedCameraSize);
  uniforms.coloringType.setValue(1);

  mandelbrot.draw();

  requestAnimationFrame(frame);
})();
