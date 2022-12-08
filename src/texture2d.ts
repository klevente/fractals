export class Texture2D {
  private readonly texture: WebGLTexture;

  constructor(private readonly gl: WebGL2RenderingContext, readonly textureUnit: number, size: number) {
    const a = Array<number>(size * size * 4).fill(Math.random());
    this.texture = this.gl.createTexture()!;
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA32F,
      size,
      size,
      0,
      this.gl.RGBA,
      this.gl.FLOAT,
      new Float32Array(a),
    );

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
  }

  commit(location: WebGLUniformLocation) {
    this.gl.uniform1i(location, this.textureUnit);
    this.gl.activeTexture(this.gl.TEXTURE0 + this.textureUnit);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
  }
}
