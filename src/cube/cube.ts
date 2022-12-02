import { FragmentShader, VertexShader } from "../shader";
import { ShaderProgram } from "../shader-program";
import { CubeGeometry } from "../cube-geometry";
import { resizeCanvasToDisplaySize } from "../util";
import { PerspectiveCamera } from "../perspective-camera";
import { Mat4 } from "../math";

const canvas = document.querySelector("canvas")!;
const gl = canvas.getContext("webgl2")!;

const vertexShaderCubeSource = `#version 300 es
precision highp float;

uniform mat4 mvp;

in vec4 position;

void main() {
  gl_Position = position * mvp;
}`;

const fragmentShaderCubeSource = `#version 300 es
precision highp float;

out vec4 fragColor;

void main() {
  fragColor = vec4(1.0, 1.0, 1.0, 1.0);
}`;

const vertexShader = new VertexShader(gl, vertexShaderCubeSource);
const fragmentShader = new FragmentShader(gl, fragmentShaderCubeSource);

const program = new ShaderProgram(gl, vertexShader, fragmentShader);
const cube = new CubeGeometry(gl, program);
const { uniforms } = cube;

const camera = new PerspectiveCamera();

resizeCanvasToDisplaySize(gl.canvas);

gl.clearColor(0, 0, 0, 1);
gl.viewport(0, 0, canvas.width, canvas.height);

const modelMatrix = Mat4.identity();
const mvp = Mat4.identity();

let tPrev = performance.now();
(function frame() {
  cube.prime();
  const t = performance.now();
  const dt = t - tPrev;
  tPrev = t;

  modelMatrix
    .rotateX(0.0003 * dt)
    .rotateY(0.0005 * dt)
    .rotateZ(0.0001 * dt);

  mvp.set(modelMatrix).mul(camera.viewProjMatrix);
  uniforms.mvp.setValue(mvp);

  cube.draw();
  requestAnimationFrame(frame);
})();
