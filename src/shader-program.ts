import { FragmentShader, VertexShader } from "./shader";
import type { Attributes, GlType, Uniforms } from "./types";
import { UnreachableCaseError } from "./util";
import { Mat4, Vec2, Vec3, Vec4 } from "./math";

export class ShaderProgram<VS extends string, FS extends string> {
  readonly programHandle: WebGLProgram;

  readonly attributes: Attributes<VS>;
  readonly uniforms: Uniforms<VS> & Uniforms<FS>;

  constructor(
    private readonly gl: WebGL2RenderingContext,
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

    const mapping = Object.entries({
      ...vertexShader.uniforms,
      ...fragmentShader.uniforms,
    }).map(([uniformName, uniformType]) => {
      const location = gl.getUniformLocation(this.programHandle, uniformName);
      if (!location) {
        throw new Error(`Unable to find uniform named ${uniformName} in program!`);
      }
      return [uniformName, {
        location,
        type: uniformType,
        setValue: this.getSetter(uniformType as GlType, location),
      }];
    });
    this.uniforms = Object.fromEntries(mapping);
  }

  private getSetter(type: GlType, location: WebGLUniformLocation) {
    switch (type) {
      case "int":
        return (value: number) => this.gl.uniform1i(location, value);
      case "uint":
        return (value: number) => this.gl.uniform1ui(location, value);
      case "float":
        return (value: number) => this.gl.uniform1f(location, value);
      case "vec2":
        return (value: Vec2) => this.gl.uniform2fv(location, value.data);
      case "vec3":
        return (value: Vec3) => this.gl.uniform3fv(location, value.data);
      case "vec4":
        return (value: Vec4) => this.gl.uniform4fv(location, value.data);
      case "mat4":
        return (value: Mat4) => this.gl.uniformMatrix4fv(location, false, value.data);
      default:
        throw new UnreachableCaseError(type);
    }
  }
}
