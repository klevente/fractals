export class Vec4 {
  readonly data: Float32Array;

  constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
    this.data = Float32Array.of(x, y, z, w);
  }

  get x(): number {
    return this.data[0];
  }

  set x(x: number) {
    this.data[0] = x;
  }

  get y(): number {
    return this.data[1];
  }

  set y(y: number) {
    this.data[1] = y;
  }

  get z(): number {
    return this.data[2];
  }

  set z(z: number) {
    this.data[2] = z;
  }

  get w(): number {
    return this.data[3];
  }

  set w(w: number) {
    this.data[3] = w;
  }

  set(x: number = 0, y: number = 0, z: number = 0, w: number = 0): Vec4 {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }

  clone(): Vec4 {
    return new Vec4(this.x, this.y, this.z, this.w);
  }

  /**
   * `this + rhs`
   * @param rhs
   */
  plus(rhs: Vec4): Vec4 {
    return new Vec4(this.x + rhs.x, this.y + rhs.y, this.z + rhs.z, this.w + rhs.w);
  }

  /**
   * `this += rhs`
   * @param rhs
   */
  add(rhs: Vec4): Vec4 {
    this.x += rhs.x;
    this.y += rhs.y;
    this.z += rhs.z;
    this.w += rhs.w;
    return this;
  }

  /**
   * `this += dt * rhs`
   * @param dt
   * @param rhs
   */
  addScaled(dt: number, rhs: Vec4): Vec4 {
    this.x += dt * rhs.x;
    this.y += dt * rhs.y;
    this.z += dt * rhs.z;
    this.w += dt * rhs.w;
    return this;
  }

  /**
   * Fast: `this = lhs + rhs`
   * @param lhs
   * @param rhs
   */
  setSum(lhs: Vec4, rhs: Vec4): Vec4 {
    this.x = lhs.x + rhs.x;
    this.y = lhs.y + rhs.y;
    this.z = lhs.z + rhs.z;
    this.w = lhs.w + rhs.w;
    return this;
  }

  /**
   * `this - rhs`
   * @param rhs
   */
  minus(rhs: Vec4): Vec4 {
    return new Vec4(this.x - rhs.x, this.y - rhs.y, this.z - rhs.z, this.w - rhs.w);
  }

  /**
   * `this -= rhs`
   * @param rhs
   */
  sub(rhs: Vec4): Vec4 {
    this.x -= rhs.x;
    this.y -= rhs.y;
    this.z -= rhs.z;
    this.w -= rhs.w;
    return this;
  }

  /**
   * Fast: `this = rhs - lhs`
   * @param lhs
   * @param rhs
   */
  setDifference(lhs: Vec4, rhs: Vec4): Vec4 {
    this.x = lhs.x - rhs.x;
    this.y = lhs.y - rhs.y;
    this.z = lhs.z - rhs.z;
    this.w = lhs.w - rhs.w;
    return this;
  }

  /**
   * `this * rhs`
   * @param rhs
   */
  times(rhs: Vec4): Vec4 {
    return new Vec4(this.x * rhs.x, this.y * rhs.y, this.z * rhs.z, this.w * rhs.w);
  }

  /**
   * `this *= rhs`
   * @param rhs
   */
  mul(rhs: Vec4): Vec4 {
    this.x *= rhs.x;
    this.y *= rhs.y;
    this.z *= rhs.z;
    this.w *= rhs.w;
    return this;
  }

  /**
   * Fast: `this = rhs * lhs`
   * @param lhs
   * @param rhs
   */
  setProduct(lhs: Vec4, rhs: Vec4): Vec4 {
    this.x = lhs.x * rhs.x;
    this.y = lhs.y * rhs.y;
    this.z = lhs.z * rhs.z;
    this.w = lhs.w * rhs.w;
    return this;
  }

  /**
   * `this / rhs`
   * @param rhs
   */
  over(rhs: Vec4): Vec4 {
    return new Vec4(this.x / rhs.x, this.y / rhs.y, this.z / rhs.z, this.w / rhs.w);
  }

  /**
   * `this /= rhs`
   * @param rhs
   */
  div(rhs: Vec4): Vec4 {
    this.x /= rhs.x;
    this.y /= rhs.y;
    this.z /= rhs.z;
    this.w /= rhs.w;
    return this;
  }

  /**
   * Fast: `this = lhs / rhs`
   * @param lhs
   * @param rhs
   */
  setQuotient(lhs: Vec4, rhs: Vec4): Vec4 {
    this.x = lhs.x / rhs.x;
    this.y = lhs.y / rhs.y;
    this.z = lhs.z / rhs.z;
    this.w = lhs.w / rhs.w;
    return this;
  }

  /**
   * Fast: `this = lhs * rhs`
   * @param lhs
   * @param rhs
   */
  setScaled(lhs: Vec4, rhs: number): Vec4 {
    this.x = lhs.x * rhs;
    this.y = lhs.y * rhs;
    this.z = lhs.z * rhs;
    this.w = lhs.w * rhs;
    return this;
  }

  lengthSquared(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }

  length(): number {
    return Math.sqrt(this.lengthSquared());
  }

  /**
   * Return a unit-length vector pointing in the same
   * direction as `this`
   */
  direction(): Vec4 {
    const length = this.length();
    return new Vec4(this.x / length, this.y / length, this.z / length, this.w / length);
  }

  /**
   * Modifies this vector to be unit-length
   */
  normalize(): Vec4 {
    const length = this.length();
    this.x /= length;
    this.y /= length;
    this.z /= length;
    this.w /= length;
    return this;
  }

  /**
   * Fast: `this = v.direction()`
   * @param v
   */
  setNormalized(v: Vec4): Vec4 {
    const length = v.length();
    this.x = v.x / length;
    this.y = v.y / length;
    this.z = v.z / length;
    this.w = v.w / length;
    return this;
  }

  /**
   * `dot(this, rhs)`
   * @param rhs
   */
  dot(rhs: Vec4): number {
    return this.x * rhs.x + this.y * rhs.y + this.z * rhs.z + this.w * rhs.w;
  }
}
