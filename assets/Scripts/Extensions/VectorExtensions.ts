import { Vec2, Vec3 } from 'cc';

export { };

declare module "cc" {
    interface Vec3 {
        toVec2(): Vec2;
    }
}

((proto) => {
    proto.toVec2 = function (this: Vec3): Vec2 {
        return new Vec2(this.x, this.y);
    }

})(Vec3.prototype);