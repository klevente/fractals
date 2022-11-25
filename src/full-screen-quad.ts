import { ShaderProgram } from "./shader-program";

const QUAD_VERTICES = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]);

export class FullScreenQuad<VS extends string, FS extends string> {
  private readonly vao: WebGLVertexArrayObject;

  constructor(
    private readonly gl: WebGL2RenderingContext,
    private readonly program: ShaderProgram<VS, FS>,
  ) {
    this.vao = this.gl.createVertexArray()!;
    this.gl.bindVertexArray(this.vao);

    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, QUAD_VERTICES, this.gl.STATIC_DRAW);

    this.gl.enableVertexAttribArray(this.program.attributes.position);
    this.gl.vertexAttribPointer(this.program.attributes.position, 2, this.gl.FLOAT, false, 0, 0);
  }

  prime() {
    this.gl.bindVertexArray(this.vao);
    this.gl.useProgram(this.program.programHandle);
  }

  draw() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);
  }

  get uniforms() {
    return this.program.uniforms;
  }
}

