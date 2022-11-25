export class Vec2 {
  readonly data: Float32Array;

  constructor(x: number = 0, y: number = 0) {
    this.data = Float32Array.of(x, y);
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

  set(x: number = 0, y: number = 0): Vec2 {
    this.x = x;
    this.y = y;
    return this;
  }

  clone(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  /**
   * `this + rhs`
   * @param rhs
   */
  plus(rhs: Vec2): Vec2 {
    return new Vec2(this.x + rhs.x, this.y + rhs.y);
  }

  /**
   * `this += rhs`
   * @param rhs
   */
  add(rhs: Vec2): Vec2 {
    this.x += rhs.x;
    this.y += rhs.y;
    return this;
  }

  /**
   * `this += dt * rhs`
   * @param dt
   * @param rhs
   */
  addScaled(dt: number, rhs: Vec2): Vec2 {
    this.x += dt * rhs.x;
    this.y += dt * rhs.y;
    return this;
  }

  /**
   * Fast: `this = lhs + rhs`
   * @param lhs
   * @param rhs
   */
  setSum(lhs: Vec2, rhs: Vec2): Vec2 {
    this.x = lhs.x + rhs.x;
    this.y = lhs.y + rhs.y;
    return this;
  }

  /**
   * `this - rhs`
   * @param rhs
   */
  minus(rhs: Vec2): Vec2 {
    return new Vec2(this.x - rhs.x, this.y - rhs.y);
  }

  /**
   * `this -= rhs`
   * @param rhs
   */
  sub(rhs: Vec2): Vec2 {
    this.x -= rhs.x;
    this.y -= rhs.y;
    return this;
  }

  /**
   * Fast: `this = rhs - lhs`
   * @param lhs
   * @param rhs
   */
  setDifference(lhs: Vec2, rhs: Vec2): Vec2 {
    this.x = lhs.x - rhs.x;
    this.y = lhs.y - rhs.y;
    return this;
  }

  /**
   * `this * rhs`
   * @param rhs
   */
  times(rhs: Vec2): Vec2 {
    return new Vec2(this.x * rhs.x, this.y * rhs.y);
  }

  /**
   * `this *= rhs`
   * @param rhs
   */
  mul(rhs: Vec2): Vec2 {
    this.x *= rhs.x;
    this.y *= rhs.y;
    return this;
  }

  /**
   * Fast: `this = rhs * lhs`
   * @param lhs
   * @param rhs
   */
  setProduct(lhs: Vec2, rhs: Vec2): Vec2 {
    this.x = lhs.x * rhs.x;
    this.y = lhs.y * rhs.y;
    return this;
  }

  /**
   * `this / rhs`
   * @param rhs
   */
  over(rhs: Vec2): Vec2 {
    return new Vec2(this.x / rhs.x, this.y / rhs.y);
  }

  /**
   * `this /= rhs`
   * @param rhs
   */
  div(rhs: Vec2): Vec2 {
    this.x /= rhs.x;
    this.y /= rhs.y;
    return this;
  }

  /**
   * Fast: `this = lhs / rhs`
   * @param lhs
   * @param rhs
   */
  setQuotient(lhs: Vec2, rhs: Vec2): Vec2 {
    this.x = lhs.x / rhs.x;
    this.y = lhs.y / rhs.y;
    return this;
  }

  /**
   * Fast: `this = lhs * rhs`
   * @param lhs
   * @param rhs
   */
  setScaled(lhs: Vec2, rhs: number): Vec2 {
    this.x = lhs.x * rhs;
    this.y = lhs.y * rhs;
    return this;
  }

  lengthSquared(): number {
    return this.x * this.x + this.y * this.y;
  }

  length(): number {
    return Math.sqrt(this.lengthSquared());
  }

  /**
   * Return a unit-length vector pointing in the same
   * direction as `this`
   */
  direction(): Vec2 {
    const length = this.length();
    return new Vec2(this.x / length, this.y / length);
  }

  /**
   * Modifies this vector to be unit-length
   */
  normalize(): Vec2 {
    const length = this.length();
    this.x /= length;
    this.y /= length;
    return this;
  }

  /**
   * Fast: `this = v.direction()`
   * @param v
   */
  setNormalized(v: Vec2): Vec2 {
    const length = v.length();
    this.x = v.x / length;
    this.y = v.y / length;
    return this;
  }

  /**
   * `dot(this, rhs)`
   * @param rhs
   */
  dot(rhs: Vec2): number {
    return this.x * rhs.x + this.y * rhs.y;
  }
}
