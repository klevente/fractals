type ExtractStringKeys<T> = Extract<keyof T, string>;

// checks whether a shader contains a declared attribute named `A`
export type HasAttribute<S extends string, A extends string> =
  S extends `${string}in ${infer _Type} ${A};\n${string}`
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
  S extends `in ${infer _Type} ${infer Value};`
    ? AccObj & { [K in Value]: number }
    : AccObj
  ;

export type AttributeKeys<S extends string> = ExtractStringKeys<Attributes<S>>;

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
  S extends `uniform ${infer _Type} ${infer Value};`
    ? _AddUniform<Value, AccObj>
    : AccObj
  ;

type _AddUniform<S extends string, AccObj> =
  // case where there's a space between variables: `a, b, c`
  S extends `${infer UniformHead}, ${infer UniformTail}`
    ? _AddUniform<UniformTail, _AddUniform<UniformHead, AccObj>>
    // case where there's no space between variables; `a,b,c`
    : S extends `${infer UniformHead},${infer UniformTail}`
    ? _AddUniform<UniformTail, _AddUniform<UniformHead, AccObj>>
    // case when there's just a single variable left: `a`
    : S extends `${infer Uniform}`
    ? AccObj & { [K in Uniform]: WebGLUniformLocation }
    : AccObj
  ;

export type UniformKeys<S extends string> = ExtractStringKeys<Uniforms<S>>;
