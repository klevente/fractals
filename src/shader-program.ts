import { FragmentShader, VertexShader } from "./shader";
import type { Attributes, Uniforms } from "./types";

export class ShaderProgram<VS extends string, FS extends string> {
  readonly programHandle: WebGLProgram;

  readonly attributes: Attributes<VS>;
  readonly uniforms: Uniforms<VS> & Uniforms<FS>;

  constructor(
    gl: WebGL2RenderingContext,
    vertexShader: VertexShader<VS>,
    fragmentShader: FragmentShader<FS>,
  ) {
    this.programHandle = gl.createProgram()!;
    gl.attachShader(this.programHandle, vertexShader.shaderHandle);
    gl.attachShader(this.programHandle, fragmentShader.shaderHandle);
    gl.linkProgram(this.programHandle);

    if (!gl.getProgramParameter(this.programHandle, gl.LINK_STATUS)) {
      throw new Error(`Unable to initialize the shader program:\n${gl.getProgramInfoLog(this.programHandle)}`);
    }

    this.attributes = Object.fromEntries(vertexShader.attributes.map((attribute) => {
      const attributeLocation = gl.getAttribLocation(this.programHandle, attribute);
      if (attributeLocation === -1) {
        throw new Error(`Unable to find attribute named ${attribute} in program!`);
      }

      return [attribute, attributeLocation];
    })) as Attributes<VS>;

    this.uniforms = Object.fromEntries([...vertexShader.uniforms, ...fragmentShader.uniforms].map((uniform) => {
      const uniformLocation = gl.getUniformLocation(this.programHandle, uniform);
      if (!uniformLocation) {
        throw new Error(`Unable to find uniform named ${uniform} in program!`);
      }
      return [uniform, uniformLocation];
    })) as Uniforms<VS> & Uniforms<FS>;
  }
}
