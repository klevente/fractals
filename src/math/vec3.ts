export class Vec3 {
  readonly data: Float32Array;

  constructor(x: number = 0, y: number = 0, z = 0) {
    this.data = Float32Array.of(x, y, z);
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

  set(x: number = 0, y: number = 0, z: number = 0): Vec3 {
    this.x = x;
    this.y = y;
    this.y = z;
    return this;
  }

  clone(): Vec3 {
    return new Vec3(this.x, this.y, this.z);
  }

  /**
   * `this + rhs`
   * @param rhs
   */
  plus(rhs: Vec3): Vec3 {
    return new Vec3(this.x + rhs.x, this.y + rhs.y, this.z + rhs.z);
  }

  /**
   * `this += rhs`
   * @param rhs
   */
  add(rhs: Vec3): Vec3 {
    this.x += rhs.x;
    this.y += rhs.y;
    this.z += rhs.z;
    return this;
  }

  /**
   * `this += dt * rhs`
   * @param dt
   * @param rhs
   */
  addScaled(dt: number, rhs: Vec3): Vec3 {
    this.x += dt * rhs.x;
    this.y += dt * rhs.y;
    this.z += dt * rhs.z;
    return this;
  }

  /**
   * Fast: `this = lhs + rhs`
   * @param lhs
   * @param rhs
   */
  setSum(lhs: Vec3, rhs: Vec3): Vec3 {
    this.x = lhs.x + rhs.x;
    this.y = lhs.y + rhs.y;
    this.z = lhs.z + rhs.z;
    return this;
  }

  /**
   * `this - rhs`
   * @param rhs
   */
  minus(rhs: Vec3): Vec3 {
    return new Vec3(this.x - rhs.x, this.y - rhs.y, this.z - rhs.z);
  }

  /**
   * `this -= rhs`
   * @param rhs
   */
  sub(rhs: Vec3): Vec3 {
    this.x -= rhs.x;
    this.y -= rhs.y;
    this.z -= rhs.z;
    return this;
  }

  /**
   * Fast: `this = rhs - lhs`
   * @param lhs
   * @param rhs
   */
  setDifference(lhs: Vec3, rhs: Vec3): Vec3 {
    this.x = lhs.x - rhs.x;
    this.y = lhs.y - rhs.y;
    this.z = lhs.z - rhs.z;
    return this;
  }

  /**
   * `this * rhs`
   * @param rhs
   */
  times(rhs: Vec3): Vec3 {
    return new Vec3(this.x * rhs.x, this.y * rhs.y, this.z * rhs.z);
  }

  /**
   * `this *= rhs`
   * @param rhs
   */
  mul(rhs: Vec3): Vec3 {
    this.x *= rhs.x;
    this.y *= rhs.y;
    this.z *= rhs.z;
    return this;
  }

  /**
   * Fast: `this = rhs * lhs`
   * @param lhs
   * @param rhs
   */
  setProduct(lhs: Vec3, rhs: Vec3): Vec3 {
    this.x = lhs.x * rhs.x;
    this.y = lhs.y * rhs.y;
    this.z = lhs.z * rhs.z;
    return this;
  }

  /**
   * `this / rhs`
   * @param rhs
   */
  over(rhs: Vec3): Vec3 {
    return new Vec3(this.x / rhs.x, this.y / rhs.y, this.z / rhs.z);
  }

  /**
   * `this /= rhs`
   * @param rhs
   */
  div(rhs: Vec3): Vec3 {
    this.x /= rhs.x;
    this.y /= rhs.y;
    this.z /= rhs.z;
    return this;
  }

  /**
   * Fast: `this = lhs / rhs`
   * @param lhs
   * @param rhs
   */
  setQuotient(lhs: Vec3, rhs: Vec3): Vec3 {
    this.x = lhs.x / rhs.x;
    this.y = lhs.y / rhs.y;
    this.z = lhs.z / rhs.z;
    return this;
  }

  /**
   * Fast: `this = lhs * rhs`
   * @param lhs
   * @param rhs
   */
  setScaled(lhs: Vec3, rhs: number): Vec3 {
    this.x = lhs.x * rhs;
    this.y = lhs.y * rhs;
    this.z = lhs.z * rhs;
    return this;
  }

  lengthSquared(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  length(): number {
    return Math.sqrt(this.lengthSquared());
  }

  /**
   * Return a unit-length vector pointing in the same
   * direction as `this`
   */
  direction(): Vec3 {
    const length = this.length();
    return new Vec3(this.x / length, this.y / length, this.z / length);
  }

  /**
   * Modifies this vector to be unit-length
   */
  normalize(): Vec3 {
    const length = this.length();
    this.x /= length;
    this.y /= length;
    this.z /= length;
    return this;
  }

  /**
   * Fast: `this = v.direction()`
   * @param v
   */
  setNormalized(v: Vec3): Vec3 {
    const length = v.length();
    this.x = v.x / length;
    this.y = v.y / length;
    this.z = v.z / length;
    return this;
  }

  /**
   * `dot(this, rhs)`
   * @param rhs
   */
  dot(rhs: Vec3): number {
    return this.x * rhs.x + this.y * rhs.y + this.z * rhs.z;
  }


  /**
   * `cross(this, rhs)`
   * @param rhs
   */
  cross(rhs: Vec3): Vec3 {
    return new Vec3(
      this.y * rhs.z - this.z * rhs.y,
      this.z * rhs.x - this.x * rhs.z,
      this.x * rhs.y - this.y * rhs.x,
    );
  }

  /**
   * Fast: `this = cross(lhs, rhs)`
   * @param lhs
   * @param rhs
   */
  setCrossProduct(lhs: Vec3, rhs: Vec3): Vec3 {
    this.x = lhs.y * rhs.z - lhs.z * rhs.y;
    this.y = lhs.z * rhs.x - lhs.x * rhs.z;
    this.z = lhs.x * rhs.y - lhs.y * rhs.x;
    return this;
  }
}
