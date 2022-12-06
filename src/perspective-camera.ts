import { Mat4, Vec3 } from "./math";

type PerspectiveCameraParams = {
  position?: Vec3,
  ahead?: Vec3,
  right?: Vec3,
  up?: Vec3,
  fov?: number,
  aspectRatio?: number,
  nearPlane?: number,
  farPlane?: number,
};

export class PerspectiveCamera {
  // private static readonly worldUp = new Vec3(0, 1, 0);

  readonly position: Vec3;
  readonly ahead: Vec3;
  readonly right: Vec3;
  readonly up: Vec3;

  private readonly fov;
  private readonly aspectRatio;
  private readonly nearPlane;
  private readonly farPlane;

  readonly viewMatrix: Mat4;
  readonly projMatrix: Mat4;
  readonly viewProjMatrix: Mat4;

  constructor(params?: PerspectiveCameraParams) {
    const {
      position = new Vec3(0, 0, 0),
      ahead = new Vec3(0, 0, -1),
      right = new Vec3(1, 0, 0),
      up = new Vec3(0, 1, 0),
      fov = 1,
      aspectRatio = 1,
      nearPlane = 0.1,
      farPlane = 1000,
    } = params ?? {};
    this.position = position;
    this.ahead = ahead;
    this.right = right;
    this.up = up;
    this.fov = fov;
    this.aspectRatio = aspectRatio;
    this.nearPlane = nearPlane;
    this.farPlane = farPlane;
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
