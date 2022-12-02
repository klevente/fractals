import { Mat4, Vec3 } from "./math";

export class PerspectiveCamera {
  // private static readonly worldUp = new Vec3(0, 1, 0);

  private fov = 1;
  private aspectRatio = 1;
  private nearPlane = 0.1;
  private farPlane = 1000;

  readonly position: Vec3;
  readonly ahead: Vec3;
  readonly right: Vec3;
  readonly up: Vec3;

  readonly viewMatrix: Mat4;
  readonly projMatrix: Mat4;
  readonly viewProjMatrix: Mat4;

  constructor() {
    this.position = new Vec3(0, 0, 3);
    this.ahead = new Vec3(0, 0, -1);
    this.right = new Vec3(1, 0, 0);
    this.up = new Vec3(0, 1, 0);
    this.viewMatrix = Mat4.identity();
    this.projMatrix = Mat4.identity();
    this.viewProjMatrix = Mat4.identity();
    this.updateViewMatrix();
    this.updateProjMatrix();
  }

  private updateViewMatrix() {
    this.viewMatrix
      .setValues(
        this.right.x, this.right.y, this.right.z, 0,
        this.up.x, this.up.y, this.up.z, 0,
        -this.ahead.x, -this.ahead.y, -this.ahead.z, 0,
        0, 0, 0, 1,
      ).translate(this.position)
      .invert();

    this.updateViewProjMatrix();
  }

  private updateProjMatrix() {
    const yScale = 1 / Math.tan(this.fov * 0.5);
    const xScale = yScale / this.aspectRatio;
    const n = this.nearPlane;
    const f = this.farPlane;
    this.projMatrix
      .setValues(
        xScale, 0, 0, 0,
        0, yScale, 0, 0,
        0, 0, (n + f) / (n - f), -1,
        0, 0, 2 * n * f / (n - f), 0,
      );

    this.updateViewProjMatrix();
  }

  private updateViewProjMatrix() {
    this.viewProjMatrix
      .set(this.viewMatrix)
      .mul(this.projMatrix);
  }
}
