type ExtractStringKeys<T> = Extract<keyof T, string>;

export type HasAttribute<S extends string, A extends string> =
  S extends `${string}in ${infer _Type} ${A};\n${string}`
    ? S
    : never;

export type HasPositionAttribute<S extends string> = HasAttribute<S, "position">;

export type Attributes<S extends string> = _Attributes<S, {
  position: number,
}>
type _Attributes<S extends string, AccObj> =
  S extends `${infer Head}\n${infer Tail}`
    ? _Attributes<Tail, _AddAttribute<Head, AccObj>>
    : _AddAttribute<S, AccObj>
  ;

type _AddAttribute<S extends string, AccObj> =
  S extends `in ${infer _Type} ${infer Value};`
    ? AccObj & { [K in Value]: number }
    : AccObj
  ;

export type AttributeKeys<S extends string> = ExtractStringKeys<Attributes<S>>;

export type Uniforms<S extends string> = _Uniforms<S, {}>;
type _Uniforms<S extends string, AccObj> =
  S extends `${infer Head}\n${infer Tail}`
    ? _Uniforms<Tail, _AddUniform<Head, AccObj>>
    : _AddUniform<S, AccObj>
  ;

type _AddUniform<S extends string, AccObj> =
  S extends `uniform ${infer _Type} ${infer Value};`
    ? AccObj & { [K in Value]: WebGLUniformLocation }
    : AccObj
  ;
export type UniformKeys<S extends string> = ExtractStringKeys<Uniforms<S>>;
