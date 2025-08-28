import { CCFloat, Component, Node, math, Vec2, Vec3, _decorator } from 'cc';
import { VoidCallbackType } from './Callbacks';
import { TimeUtils } from './TimeUtils';
const { ccclass, property } = _decorator;

@ccclass('FlyingObject')
export class FlyingObject extends Component {
    @property({ visible: true, type: CCFloat }) protected defaultDuration: number = 0.5;
    @property({ visible: true, type: CCFloat }) protected defaultDelay: number = 0.0;

    protected startPosition: Vec2 = new Vec2();
    protected destPosition: Vec2 = new Vec2();
    protected delay: number = 0.0;
    protected duration: number = 0.5;
    protected endLinger: number = 0;
    protected wavyness: number = 0;
    protected pointAtDestination: boolean = false;
    protected scaleMultiplier: number = 1.0;
    protected circular: boolean = false;
    protected circularAmount: number = 1;
    protected endScaleMultiplier: number = 1.0;

    private isStart = false;
    private isFinish = false;
    private count = 0;

    public SetStartAndEnd(startPosition: Vec2, destPosition: Vec2): FlyingObject {
        this.startPosition = startPosition;
        this.destPosition = destPosition;
        return this;
    }

    public SetDelay(delay: number): FlyingObject {
        this.delay = delay;
        return this;
    }

    public SetDuration(duration: number): FlyingObject {
        this.duration = duration;
        return this;
    }

    public SetWavyness(wavyness: number): FlyingObject {
        this.wavyness = wavyness;
        return this;
    }

    public SetScaleMultiplier(scaleMultiplier: number): FlyingObject {
        this.scaleMultiplier = scaleMultiplier;
        return this;
    }

    public SetEndScaleMultiplier(endScaleMultiplier: number): FlyingObject {
        this.endScaleMultiplier = endScaleMultiplier;
        return this;
    }

    public SetPointAtDestination(pointAtDestination: boolean): FlyingObject {
        this.pointAtDestination = pointAtDestination;
        return this;
    }

    public SetCircular(circularAmount: number): FlyingObject {
        this.circular = true;
        this.circularAmount = circularAmount;
        return this;
    }

    public Init(startPosition: Vec2, destPosition: Vec2, onComplete: VoidCallbackType, delay: number = -1, duration: number = -1): void {
        if (duration < 0) {
            duration = this.defaultDuration;
        }
        if (delay < 0) {
            delay = this.defaultDelay;
        }
        this.count = 0;
        this.SetStartAndEnd(startPosition, destPosition).SetDelay(delay).SetDuration(duration).Run(onComplete);
    }

    public Run(onComplete: () => void): void {
        this.Fly(onComplete).then(() => {
            return new Promise<void>((resolve) => {
                const checkFinishInterval = setInterval(() => {
                    if (this.isFinish) {
                        clearInterval(checkFinishInterval);
                        this.node.setWorldPosition(new Vec3(this.destPosition.x, this.destPosition.y, 0));
                        resolve();
                    }
                }, 100);
            });
        }).then(() => {
            onComplete();
            this.EndFly();
        }).catch((error) => {
            console.error("Error:", error);
        });
    }

    private static GrowShrink(n: number): number {
        return 0.5 - Math.cos(2 * Math.PI * n) / 2;
    }

    protected update(dt: number): void {
        if (this.isStart == false && this.isFinish == true) return;
        const startScale: number = this.node.scale.x;
        const targetFPS = 60;
        const fixedDeltaTime = 1 / targetFPS;

        if (this.count < this.duration) {
            const normalizedTime = this.count / this.duration;
            this.node.worldPosition = this.GetPositionForNormalizedTime(normalizedTime);
            let s = startScale + (this.scaleMultiplier - 1) * (normalizedTime * (1 - normalizedTime) * 4);
            s *= math.lerp(1, this.endScaleMultiplier, normalizedTime);
            this.node.scale = new Vec3(s, s, 1);
            if (this.pointAtDestination) {
                let ea: Vec3 = new Vec3();
                Vec3.copy(ea, this.node.eulerAngles);
                ea.z = this.GetRotationTowardsDestination(this.node.getWorldPosition().toVec2()) * 180 / Math.PI - 90;
                Vec3.copy(this.node.eulerAngles, ea);
            }
            this.OnFlyTick();

            if (!this.node || !this.node.active) {
                return;
            }

            this.count += fixedDeltaTime;
        }
        else
            this.isFinish = true;
    }

    private GetPositionForNormalizedTime(normalizedTime: number): Vec3 {
        if (!this.circular) {
            const offset = Math.atan2(this.startPosition.y - this.destPosition.y, this.startPosition.x - this.destPosition.x);

            let deltaVector: Vec2 = new Vec2();
            Vec2.subtract(deltaVector, this.startPosition, this.destPosition);

            const flowMag: number = this.wavyness * deltaVector.length() / 5;
            let center: Vec2 = new Vec2();
            Vec2.lerp(center, this.startPosition, this.destPosition, normalizedTime);
            const flowGrowMag: number = flowMag * FlyingObject.GrowShrink(normalizedTime);
            const flow: Vec2 = new Vec2(Math.cos(offset + Math.PI * normalizedTime), Math.sin(offset + Math.PI * normalizedTime));

            let sflow: Vec2 = new Vec2();
            Vec2.multiplyScalar(sflow, flow, flowGrowMag);
            let resultVec: Vec2 = new Vec2();
            Vec2.add(resultVec, center, sflow);

            return new Vec3(resultVec.x, resultVec.y, 0);
        }
        else {
            let center: Vec2 = new Vec2();
            Vec2.add(center, this.startPosition, this.destPosition);
            Vec2.multiplyScalar(center, center, 0.5);/// 2;
            let dx: Vec2 = new Vec2();
            Vec2.subtract(dx, this.startPosition, center);
            let dy: Vec2 = new Vec2();
            Vec2.multiplyScalar(dy, new Vec2(-dx.y, dx.x), this.circularAmount);

            const rads = normalizedTime * Math.PI;

            let dxr: Vec2 = new Vec2();
            Vec2.multiplyScalar(dx, dx, Math.cos(rads));
            let dyr: Vec2 = new Vec2();
            Vec2.multiplyScalar(dy, dy, Math.sin(rads));

            Vec2.add(center, center, dxr);
            Vec2.add(center, center, dyr);
            return new Vec3(center.x, center.y, 0);
        }
    }

    private GetRotationTowardsDestination(position: Vec2): number {
        let offset: Vec2 = new Vec2();
        Vec2.subtract(offset, this.destPosition, position);
        return Math.atan2(offset.y, offset.x);
    }

    public BeginFly(): void {
        this.node.setWorldPosition(new Vec3(this.startPosition.x, this.startPosition.y, 0));
        this.isStart = true;
    }

    public EndFly(): void {
        // this.node.destroy();
    }

    protected OnFlyTick(): void {
    }

    private async Fly(onComplete: VoidCallbackType): Promise<void> {
        this.BeginFly();

        if (this.duration > 0) {
            let oldScale: Vec3 = new Vec3();
            Vec3.copy(oldScale, this.node.scale);
            this.node.scale = new Vec3(0, 0, 0);
            if (this.delay > 0.0)
                await TimeUtils.Timeout(this.delay * 1000);
            this.node.scale = oldScale;
        }
    }
}