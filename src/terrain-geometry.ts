import { ShaderProgram } from "./shader-program";

export class TerrainGeometry<VS extends string, FS extends string> {
  private readonly vao: WebGLVertexArrayObject;
  private readonly vertices: Float32Array;

  constructor(
    private readonly gl: WebGL2RenderingContext,
    private readonly program: ShaderProgram<VS, FS>,
    /*width: number,
    height: number,
    scale: number,*/
  ) {

    const scale = 0.1;
    const rawVertices: number[] = [];

    // instead of this, use a texture which draws an outline for the triangles,
    // and use TRIANGLE_STRIPs for drawing, so every vertex only appears once
    // will have to pre-generate all z-values in advance, so I can set the
    // same vertices to the same height (also useful for current approach).
    // for setting values dynamically, I can generate an array at every frame
    // and have it passed in as an attribute to the vertex shader to provide the z coord
    // or I can use a texture that I can sample at every frame
    for (let y = -2; y <= 2; y += scale) {
      for (let x = -2; x <= 2; x += scale) {
        rawVertices.push(x, y);
        rawVertices.push((x + scale), y);

        rawVertices.push((x + scale), y);
        rawVertices.push(x, (y + scale));

        rawVertices.push(x, (y + scale));
        rawVertices.push(x, y);

        rawVertices.push(x, (y + scale));
        rawVertices.push((x + scale), (y + scale));

        rawVertices.push((x + scale), (y + scale));
        rawVertices.push((x + scale), y);
      }
    }

   /* rawVertices.push(-1, -1);
    rawVertices.push(-.9, -1);

    rawVertices.push(-.9, -1);
    rawVertices.push(-1, -.9);

    rawVertices.push(-1, -.9);
    rawVertices.push(-1, -1);

    rawVertices.push(-1, -.9);
    rawVertices.push(-.9, -.9);

    rawVertices.push(-.9, -.9);
    rawVertices.push(-.9, -1);*/

    this.vertices = new Float32Array(rawVertices);

    this.vao = this.gl.createVertexArray()!;
    this.gl.bindVertexArray(this.vao);

    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.STATIC_DRAW);

    this.gl.enableVertexAttribArray(this.program.attributes.position);
    this.gl.vertexAttribPointer(this.program.attributes.position, 2, this.gl.FLOAT, false, 0, 0);
  }

  prime() {
    this.gl.bindVertexArray(this.vao);
    this.gl.useProgram(this.program.programHandle);
  }

  draw() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.drawArrays(this.gl.LINES, 0, this.vertices.length / 2);
  }

  get uniforms() {
    return this.program.uniforms;
  }
}
