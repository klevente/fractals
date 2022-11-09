export type Attributes<P extends string> =
  P extends `${string}in ${infer _Type} position;\n${string}`
    ? _Attributes<P, {
      position: number,
    }>
    : never;
type _Attributes<P extends string, AccObj> =
  P extends `${infer Head}\n${infer Tail}`
    ? _Attributes<Tail, _AddAttribute<Head, AccObj>>
    : _AddAttribute<P, AccObj>
  ;

type _AddAttribute<P extends string, AccObj> =
  P extends `in ${infer _Type} ${infer Value};`
    ? AccObj & { [K in Value]: number }
    : AccObj
  ;

export type AttributeKeys<T extends string> = [T] extends [never] ?
  never :
  Extract<keyof Attributes<T>, string>;

export type Uniforms<P extends string> = _Uniforms<P, {}>;
type _Uniforms<P extends string, AccObj> =
  P extends `${infer Head}\n${infer Tail}`
    ? _Uniforms<Tail, _AddUniform<Head, AccObj>>
    : _AddUniform<P, AccObj>
  ;

type _AddUniform<P extends string, AccObj> =
  P extends `uniform ${infer _Type} ${infer Value};`
    ? AccObj & { [K in Value]: WebGLUniformLocation }
    : AccObj
  ;

export type UniformKeys<T extends string> = Extract<keyof Uniforms<T>, string>;
