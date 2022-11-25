import { Mat4, Vec2, Vec3, Vec4 } from "./math";

type ExtractStringKeys<T> = Extract<keyof T, string>;

/*type TrimStart<X> = X extends ` ${infer Y}`
  ? TrimStart<Y> : X extends `\t${infer Y}`
  ? TrimStart<Y> : X;

type TrimEnd<X> = X extends `${infer Y} `
  ? TrimEnd<Y> : X extends `${infer Y}\t`
  ? TrimEnd<Y> : X;

type Trim<X> = TrimStart<TrimEnd<X>>;*/

export type GlType = "int" | "uint" | "float" | "vec2" | "vec3" | "vec4" | "mat4";

export type JsType<Type extends GlType> = Type extends "int" | "uint" | "float"
  ? number
  : Type extends "vec2"
  ? Vec2
  : Type extends "vec3"
  ? Vec3
  : Type extends "vec4"
  ? Vec4
  : Type extends "mat4"
  ? Mat4
  : never;

// checks whether a shader contains a declared attribute named `A`
export type HasAttribute<S extends string, A extends string> =
  S extends `${string}in ${infer _Type extends GlType} ${A};\n${string}`
    ? S
    : never;

export type HasPositionAttribute<S extends string> = HasAttribute<S, "position">;

export type Attributes<S extends string> = _Attributes<S, {
  position: number,
}>

// collects all input attribute names from a shader
type _Attributes<S extends string, AccObj> =
  S extends `${infer Head}\n${infer Tail}`
    ? _Attributes<Tail, _AddAttribute<Head, AccObj>>
    : _AddAttribute<S, AccObj>
  ;

type _AddAttribute<S extends string, AccObj> =
  // parses a line with one attribute declaration
  // `in vec2 position;`
  S extends `in ${infer _Type extends GlType} ${infer Value};`
    ?  AccObj & { [K in Value]: number }
    : AccObj
  ;

export type AttributeKeys<S extends string> = ExtractStringKeys<Attributes<S>>;

export type UniformSetterFn<Type extends GlType> = (value: JsType<Type>) => void;

export type UniformValue<Type extends GlType> = {
  location: WebGLUniformLocation,
  type: Type,
  setValue: UniformSetterFn<Type>
}

export type Uniforms<S extends string> = _Uniforms<S, {}>;

// collects all uniform variable names from a shader
type _Uniforms<S extends string, AccObj> =
  S extends `${infer Head}\n${infer Tail}`
    ? _Uniforms<Tail, _AddUniforms<Head, AccObj>>
    : _AddUniforms<S, AccObj>
  ;

type _AddUniforms<S extends string, AccObj> =
  // parses a line with one or more uniform variable declarations(s):
  // `uniform vec2 a, b, c, d;`
  S extends `uniform ${infer Type extends GlType} ${infer Value};`
    ? _AddUniform<Value, Type, AccObj>
    : AccObj
  ;

type _AddUniform<S extends string, Type extends GlType, AccObj> =
  // case where there's a space between variables: `a, ...`
  S extends `${infer UniformHead}, ${infer UniformTail}`
    ? _AddUniform<UniformTail, Type, _AddUniform<UniformHead, Type, AccObj>>
    // case when there's just a single variable left: `a`
    : S extends `${infer Uniform}`
    ? AccObj & { [K in Uniform]: UniformValue<Type> }
    : AccObj
  ;

type UniformHelper<U extends Uniforms<string>> =  {
  [K in keyof U]: U[K] extends UniformValue<GlType> ? U[K]["type"] : never
};

export type UniformKeys<S extends string> = UniformHelper<Uniforms<S>>;

/*const testShader = `
uniform vec2 a, b;
uniform float c, d, e;
uniform vec4.ts f;
`;

declare function testFn<S extends string>(shader: S): UniformKeys<S>;
declare function testFn2<S extends string>(shader: S): Uniforms<S>;
const result = testFn(testShader);
const result2 = testFn2(testShader);*/
