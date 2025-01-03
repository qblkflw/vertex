import { Vector, vectorZeroes } from '../../math/vector/Vector';
import { RigidBodyOptions } from './RigidBody.utils';
import { Entity } from '../../game/entity/Entity';
import { RigidBodyTransform } from './RigidBody.types';
import { Sphere } from '../../math/sphere/Sphere';

export class RigidBody {
  private _position: Vector;
  private _direction: Vector;
  private _mass: number;
  private _transforms: Record<string, RigidBodyTransform>;
  private _forces: Record<string, Vector> = {};
  private _boundingSphere: Sphere;
  private _parentEntity?: Entity;

  constructor(options?: RigidBodyOptions) {
    this._position = options?.position ?? vectorZeroes(3);
    this._direction = options?.direction ?? vectorZeroes(3);
    this._mass = options?.mass ?? 1;
    this._forces = options?.forces ?? {};
    this._transforms = options?.transforms ?? {};
    this._boundingSphere = new Sphere(
      this._position,
      options?.sphereRadius ?? 0
    );
    this._parentEntity = options?.parentEntity;
  }

  update(dTime: number, entities: Record<string, Entity>) {
    const { transforms } = this;

    Object.keys(transforms).forEach((id) => {
      transforms[id].bind(this)(dTime, this, entities);
    });
  }

  addForce(id: string, force: Vector, recursive = true) {
    if (this._parentEntity && recursive) {
      Object.keys(this._parentEntity.children).forEach((childId) => {
        const childEntity = this._parentEntity?.children[childId];
        childEntity && childEntity.body?.addForce(id, force);
      });
    }

    this._forces[id] = force;
  }

  addTransform(id: string, transform: RigidBodyTransform, recursive = true) {
    if (this._parentEntity && recursive) {
      Object.keys(this._parentEntity.children).forEach((childId) => {
        const childEntity = this._parentEntity?.children[childId];
        childEntity && childEntity?.body?.addTransform(id, transform);
      });
    }

    this._transforms[id] = transform;
  }

  get position() {
    return this._position;
  }

  get direction() {
    return this._direction;
  }

  set position(v: Vector) {
    this._position = v;
  }

  set direction(v: Vector) {
    this._direction = v;
  }

  get mass() {
    return this._mass;
  }

  get transforms() {
    return this._transforms;
  }

  get forces() {
    return this._forces;
  }

  get boundingSphere() {
    return this._boundingSphere;
  }

  set boundingSphere(s: Sphere) {
    this._boundingSphere = s;
  }
}
