import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TargetFollower')
export class TargetFollower extends Component {
    @property({ type: Node }) public target: Node;
    @property({ type: Number }) public offsetX: number = 0;
    @property({ type: Number }) public offsetY: number = 0;
    @property({ type: Number }) public offsetZ: number = 0;
    @property({ type: Boolean }) public isInstant: boolean = true;

    
    protected lateUpdate(dt: number): void {
        let a = new Vec3(this.target.worldPosition.x + this.offsetX, this.target.worldPosition.y + this.offsetY, this.target.worldPosition.z - this.offsetZ);
        if (this.isInstant) {
            this.node.setWorldPosition(a);
        }
        else {
            let pos = new Vec3();
            Vec3.lerp(pos, this.node.getWorldPosition(), a, 0.1);
            this.node.setWorldPosition(pos);

        }

    }

}


