import { FragmentShader, VertexShader } from "../shader";
import { ShaderProgram } from "../shader-program";
import { resizeCanvasToDisplaySize } from "../util";
import { TerrainGeometry } from "../terrain-geometry";
import { Mat4, Vec3 } from "../math";
import { PerspectiveCamera } from "../perspective-camera";
import { Texture2D } from "../texture2d";

const canvas = document.querySelector("canvas")!;
const gl = canvas.getContext("webgl2")!;

const vertexShaderTerrainSource = `#version 300 es
precision highp float;

uniform mat4 mvp;
uniform sampler2D randomImage;
uniform float t;

in vec2 position;

float rand(vec2 co) {
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

float fade(float t) {
  return (t*t*t) * (t * (t*6.0 - 15.0) + 10.0);
}

vec2 grad(vec2 p) {
  const float texture_width = 256.0;
  vec4 v = texture(randomImage, vec2(p.x / texture_width, p.y / texture_width));
  // vec2 v = p;
  return normalize(v.xy * 2.0 - vec2(1.0));
}

float noise(vec2 p) {
  vec2 p0 = floor(p);
  vec2 p1 = p0 + vec2(1.0, 0.0);
  vec2 p2 = p0 + vec2(0.0, 1.0);
  vec2 p3 = p0 + vec2(1.0, 1.0);

  vec2 g0 = grad(p0);
  vec2 g1 = grad(p1);
  vec2 g2 = grad(p2);
  vec2 g3 = grad(p3);

  float t0 = p.x - p0.x;
  float fade_t0 = fade(t0);

  float t1 = p.y - p0.y;
  float fade_t1 = fade(t1);

  float p0p1 = (1.0 - fade_t0) * dot(g0, (p - p0)) + fade_t0 * dot(g1, (p - p1));
  float p2p3 = (1.0 - fade_t0) * dot(g2, (p - p2)) + fade_t0 * dot(g3, (p - p3));

  return (1.0 - fade_t1) * p0p1 + fade_t1 * p2p3;
}

void main() {
  // float z = rand(position) / 10.0;
  vec2 a = vec2(position.x, position.y + t / 5000.0);
  float z =
    noise(vec2(position.x, position.y + t / 3000.0) / 1.0) / 1.0 +
    noise(vec2(position.x, position.y + t / 3000.0) * 5.0) / 5.0 +
    noise(vec2(position.x, position.y + t / 3000.0) * 7.0) / 14.0;
  gl_Position = vec4(position, z, 1) * mvp;
}`;

const fragmentShaderTerrainSource = `#version 300 es
precision highp float;

out vec4 fragColor;

void main() {
  fragColor = vec4(1.0, 1.0, 1.0, 1.0);
}`;

const vertexShader = new VertexShader(gl, vertexShaderTerrainSource);
const fragmentShader = new FragmentShader(gl, fragmentShaderTerrainSource);

const program = new ShaderProgram(gl, vertexShader, fragmentShader);
const terrain = new TerrainGeometry(gl, program);
const { uniforms } = terrain;

const texture = new Texture2D(gl, 0, 256);

const camera = new PerspectiveCamera({
  position: new Vec3(0, 0, 3),
});

resizeCanvasToDisplaySize(gl.canvas);

gl.clearColor(0, 0, 0, 1);
gl.viewport(0, 0, canvas.width, canvas.height);

uniforms.randomImage.setValue(texture);

const mvp = Mat4
  .identity()
  .rotateX(Math.PI / 3)
  .mul(camera.viewProjMatrix);

(function frame() {
  terrain.prime();
  const t = performance.now();

  uniforms.mvp.setValue(mvp);
  uniforms.t.setValue(t);

  terrain.draw();
  requestAnimationFrame(frame);
})();
