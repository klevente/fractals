import { Vec3 } from "./vec3";

export class Mat4 {
  readonly data: Float32Array;

  constructor(
    m00: number, m01: number, m02: number, m03: number,
    m10: number, m11: number, m12: number, m13: number,
    m20: number, m21: number, m22: number, m23: number,
    m30: number, m31: number, m32: number, m33: number,
  ) {
    this.data = Float32Array.of(
      m00, m10, m20, m30,
      m01, m11, m21, m31,
      m02, m12, m22, m32,
      m03, m13, m23, m33,
    );
  }

  static identity(): Mat4 {
    return new Mat4(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    );
  }

  setValues(
    m00: number, m01: number, m02: number, m03: number,
    m10: number, m11: number, m12: number, m13: number,
    m20: number, m21: number, m22: number, m23: number,
    m30: number, m31: number, m32: number, m33: number,
  ): Mat4 {
    this.data.set([
      m00, m10, m20, m30,
      m01, m11, m21, m31,
      m02, m12, m22, m32,
      m03, m13, m23, m33,
    ]);
    return this;
  }

  set(m: Mat4): Mat4 {
    this.data.set(m.data);
    return this;
  }

  reset(): Mat4 {
    this.setValues(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    );
    return this;
  }

  mul(rhs: Mat4): Mat4 {
    const m00 = this.data[0];
    const m01 = this.data[4];
    const m02 = this.data[8];
    const m03 = this.data[12];
    const m10 = this.data[1];
    const m11 = this.data[5];
    const m12 = this.data[9];
    const m13 = this.data[13];
    const m20 = this.data[2];
    const m21 = this.data[6];
    const m22 = this.data[10];
    const m23 = this.data[14];
    const m30 = this.data[3];
    const m31 = this.data[7];
    const m32 = this.data[11];
    const m33 = this.data[15];
    const n00 = rhs.data[0];
    const n01 = rhs.data[4];
    const n02 = rhs.data[8];
    const n03 = rhs.data[12];
    const n10 = rhs.data[1];
    const n11 = rhs.data[5];
    const n12 = rhs.data[9];
    const n13 = rhs.data[13];
    const n20 = rhs.data[2];
    const n21 = rhs.data[6];
    const n22 = rhs.data[10];
    const n23 = rhs.data[14];
    const n30 = rhs.data[3];
    const n31 = rhs.data[7];
    const n32 = rhs.data[11];
    const n33 = rhs.data[15];
    this.data[0] = (m00 * n00) + (m01 * n10) + (m02 * n20) + (m03 * n30);
    this.data[1] = (m10 * n00) + (m11 * n10) + (m12 * n20) + (m13 * n30);
    this.data[2] = (m20 * n00) + (m21 * n10) + (m22 * n20) + (m23 * n30);
    this.data[3] = (m30 * n00) + (m31 * n10) + (m32 * n20) + (m33 * n30);
    this.data[4] = (m00 * n01) + (m01 * n11) + (m02 * n21) + (m03 * n31);
    this.data[5] = (m10 * n01) + (m11 * n11) + (m12 * n21) + (m13 * n31);
    this.data[6] = (m20 * n01) + (m21 * n11) + (m22 * n21) + (m23 * n31);
    this.data[7] = (m30 * n01) + (m31 * n11) + (m32 * n21) + (m33 * n31);
    this.data[8] = (m00 * n02) + (m01 * n12) + (m02 * n22) + (m03 * n32);
    this.data[9] = (m10 * n02) + (m11 * n12) + (m12 * n22) + (m13 * n32);
    this.data[10] = (m20 * n02) + (m21 * n12) + (m22 * n22) + (m23 * n32);
    this.data[11] = (m30 * n02) + (m31 * n12) + (m32 * n22) + (m33 * n32);
    this.data[12] = (m00 * n03) + (m01 * n13) + (m02 * n23) + (m03 * n33);
    this.data[13] = (m10 * n03) + (m11 * n13) + (m12 * n23) + (m13 * n33);
    this.data[14] = (m20 * n03) + (m21 * n13) + (m22 * n23) + (m23 * n33);
    this.data[15] = (m30 * n03) + (m31 * n13) + (m32 * n23) + (m33 * n33);
    return this;
  }

  scale(v: Vec3): Mat4 {
    const { x, y, z } = v;
    this.data[0] = this.data[0] * x;
    this.data[1] = this.data[1] * x;
    this.data[2] = this.data[2] * x;
    this.data[3] = this.data[3] * x;
    this.data[4] = this.data[4] * y;
    this.data[5] = this.data[5] * y;
    this.data[6] = this.data[6] * y;
    this.data[7] = this.data[7] * y;
    this.data[8] = this.data[8] * z;
    this.data[9] = this.data[9] * z;
    this.data[10] = this.data[10] * z;
    this.data[11] = this.data[11] * z;
    return this;
  }

  translate(v: Vec3): Mat4 {
    const { x, y, z } = v;
    this.data[0] += this.data[12] * x;
    this.data[4] += this.data[12] * y;
    this.data[8] += this.data[12] * z;
    this.data[1] += this.data[13] * x;
    this.data[5] += this.data[13] * y;
    this.data[9] += this.data[13] * z;
    this.data[2] += this.data[14] * x;
    this.data[6] += this.data[14] * y;
    this.data[10] += this.data[14] * z;
    this.data[3] += this.data[15] * x;
    this.data[7] += this.data[15] * y;
    this.data[11] += this.data[15] * z;
    return this;
  }

  rotateX(angle: number): Mat4 {
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    const a10 = this.data[4];
    const a11 = this.data[5];
    const a12 = this.data[6];
    const a13 = this.data[7];
    const a20 = this.data[8];
    const a21 = this.data[9];
    const a22 = this.data[10];
    const a23 = this.data[11];

    this.data[4] = a10 * c + a20 * s;
    this.data[5] = a11 * c + a21 * s;
    this.data[6] = a12 * c + a22 * s;
    this.data[7] = a13 * c + a23 * s;
    this.data[8] = a20 * c - a10 * s;
    this.data[9] = a21 * c - a11 * s;
    this.data[10] = a22 * c - a12 * s;
    this.data[11] = a23 * c - a13 * s;

    return this;
  }

  rotateY(angle: number): Mat4 {
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    const a00 = this.data[0];
    const a01 = this.data[1];
    const a02 = this.data[2];
    const a03 = this.data[3];
    const a20 = this.data[8];
    const a21 = this.data[9];
    const a22 = this.data[10];
    const a23 = this.data[11];

    this.data[0] = a00 * c - a20 * s;
    this.data[1] = a01 * c - a21 * s;
    this.data[2] = a02 * c - a22 * s;
    this.data[3] = a03 * c - a23 * s;
    this.data[8] = a00 * s + a20 * c;
    this.data[9] = a01 * s + a21 * c;
    this.data[10] = a02 * s + a22 * c;
    this.data[11] = a03 * s + a23 * c;

    return this;
  }

  rotateZ(angle: number): Mat4 {
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    const a00 = this.data[0];
    const a01 = this.data[1];
    const a02 = this.data[2];
    const a03 = this.data[3];
    const a10 = this.data[4];
    const a11 = this.data[5];
    const a12 = this.data[6];
    const a13 = this.data[7];

    this.data[0] = a00 * c + a10 * s;
    this.data[1] = a01 * c + a11 * s;
    this.data[2] = a02 * c + a12 * s;
    this.data[3] = a03 * c + a13 * s;
    this.data[4] = a10 * c - a00 * s;
    this.data[5] = a11 * c - a01 * s;
    this.data[6] = a12 * c - a02 * s;
    this.data[7] = a13 * c - a03 * s;
    return this;
  }

  invert(): Mat4 {
    const a00 = this.data[0];
    const a01 = this.data[1];
    const a02 = this.data[2];
    const a03 = this.data[3];
    const m000 = this.data[4];
    const m001 = this.data[5];
    const m002 = this.data[6];
    const m003 = this.data[7];
    const m100 = this.data[8];
    const m101 = this.data[9];
    const m102 = this.data[10];
    const m103 = this.data[11];
    const m200 = this.data[12];
    const m201 = this.data[13];
    const m202 = this.data[14];
    const m203 = this.data[15];
    const b00 = a00 * m001 - a01 * m000;
    const b01 = a00 * m002 - a02 * m000;
    const b02 = a00 * m003 - a03 * m000;
    const b03 = a01 * m002 - a02 * m001;
    const b04 = a01 * m003 - a03 * m001;
    const b05 = a02 * m003 - a03 * m002;
    const b06 = m100 * m201 - m101 * m200;
    const b07 = m100 * m202 - m102 * m200;
    const b08 = m100 * m203 - m103 * m200;
    const b09 = m101 * m202 - m102 * m201;
    const m010 = m101 * m203 - m103 * m201;
    const m011 = m102 * m203 - m103 * m202;
    const det =
      (b00 * m011 - b01 * m010 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06);
    if (det === 0.0) {
      return this;
    }
    const invDet = 1.0 / det;
    this.data[0] = (m001 * m011 - m002 * m010 + m003 * b09) * invDet;
    this.data[1] = (-a01 * m011 + a02 * m010 - a03 * b09) * invDet;
    this.data[2] = (m201 * b05 - m202 * b04 + m203 * b03) * invDet;
    this.data[3] = (-m101 * b05 + m102 * b04 - m103 * b03) * invDet;
    this.data[4] = (-m000 * m011 + m002 * b08 - m003 * b07) * invDet;
    this.data[5] = (a00 * m011 - a02 * b08 + a03 * b07) * invDet;
    this.data[6] = (-m200 * b05 + m202 * b02 - m203 * b01) * invDet;
    this.data[7] = (m100 * b05 - m102 * b02 + m103 * b01) * invDet;
    this.data[8] = (m000 * m010 - m001 * b08 + m003 * b06) * invDet;
    this.data[9] = (-a00 * m010 + a01 * b08 - a03 * b06) * invDet;
    this.data[10] = (m200 * b04 - m201 * b02 + m203 * b00) * invDet;
    this.data[11] = (-m100 * b04 + m101 * b02 - m103 * b00) * invDet;
    this.data[12] = (-m000 * b09 + m001 * b07 - m002 * b06) * invDet;
    this.data[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
    this.data[14] = (-m200 * b03 + m201 * b01 - m202 * b00) * invDet;
    this.data[15] = (m100 * b03 - m101 * b01 + m102 * b00) * invDet;
    return this;
  }
}
