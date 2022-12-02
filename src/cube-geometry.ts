import { ShaderProgram } from "./shader-program";

const CUBE_VERTICES = Float32Array.of(
  -.5, -.5, .5,
  .5, -.5, .5,
  .5, -.5, .5,
  .5, -.5, -.5,
  .5, -.5, -.5,
  -.5, -.5, -.5,
  -.5, -.5, -.5,
  -.5, -.5, .5,
  -.5, .5, .5,
  .5, .5, .5,
  .5, .5, .5,
  .5, .5, -.5,
  .5, .5, -.5,
  -.5, .5, -.5,
  -.5, .5, -.5,
  -.5, .5, .5,
  -.5, -.5, .5,
  -.5, .5, .5,
  .5, -.5, .5,
  .5, .5, .5,
  .5, -.5, -.5,
  .5, .5, -.5,
  -.5, -.5, -.5,
  -.5, .5, -.5,
);

export class CubeGeometry<VS extends string, FS extends string> {
  private readonly vao: WebGLVertexArrayObject;

  constructor(
    private readonly gl: WebGL2RenderingContext,
    private readonly program: ShaderProgram<VS, FS>,
  ) {
    this.vao = this.gl.createVertexArray()!;
    this.gl.bindVertexArray(this.vao);

    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, CUBE_VERTICES, this.gl.STATIC_DRAW);

    this.gl.enableVertexAttribArray(this.program.attributes.position);
    this.gl.vertexAttribPointer(this.program.attributes.position, 3, this.gl.FLOAT, false, 0, 0);
  }

  prime() {
    this.gl.bindVertexArray(this.vao);
    this.gl.useProgram(this.program.programHandle);
  }

  draw() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.drawArrays(this.gl.LINES, 0, CUBE_VERTICES.length);
  }

  get uniforms() {
    return this.program.uniforms;
  }
}
