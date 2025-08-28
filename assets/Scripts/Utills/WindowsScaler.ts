import { Component, _decorator, Node, Size, Vec2, Vec3, equals, math, CCBoolean, size, clamp } from "cc";
import { TimeUtils } from "./TimeUtils";
import { UITransform } from "cc";
import { UITransformComponent } from "cc";
import { AdaptiveWidget } from "./AdaptiveWidget";
const { ccclass, property,executeInEditMode } = _decorator;


export enum EOrientationType{
    Horizontal = 0,
    Vertical = 1
}

@ccclass('WindowsScaler')
// @executeInEditMode(true)
export class WindowsScaler extends Component {
    private static instance: WindowsScaler = null;
    public static get Instance() {
        return WindowsScaler.instance;
    }
    private allListeners: AdaptiveWidget[] = [];
    private readonly baseSize: Size = new Size(1280, 720);
    private lastWindowSize: Size = null;
    private baseRatio: number = 1;
    private curRatio: number;
    private orientation: number = 0;
    public get Orientation() {
        return this.orientation;
    }
    private realOrientation: number = 0;
    public get Realorientation() {
        return this.realOrientation;
    }
    private scaleRatio: number = 0;
    public get UIScale() {
        return this.scaleRatio;
    }
    private margin: number = 0;
    public get MarginScale() {
        return this.margin;
    }
    private distanceToScreenBorders: Vec2 = new Vec2(0, 0);
    public get ScreenBorders() {
        return this.distanceToScreenBorders.clone();
    }
    private windowSizeInCanvas: Vec2 = new Vec2(0, 0);
    public get CanvasWindowSize() {
        return this.windowSizeInCanvas.clone();
    }

    protected start(): void {
        WindowsScaler.instance = this;
        this.baseRatio = this.baseSize.x / this.baseSize.y;
    }
    protected update(dt: number): void {
        const windowInnerWidth = window.innerWidth;
        const windowInnerHeight = window.innerHeight;
        let curWindowSize: Size = new Size(windowInnerWidth, windowInnerHeight);
        if (!this.lastWindowSize || !this.EqualSize(curWindowSize, this.lastWindowSize)) {
            this.curRatio = curWindowSize.x / curWindowSize.y;
            this.orientation = this.curRatio < this.baseRatio ? EOrientationType.Vertical : EOrientationType.Horizontal;
            this.realOrientation = this.curRatio < 1 ? EOrientationType.Vertical : EOrientationType.Horizontal;
            this.scaleRatio = clamp(this.curRatio, this.baseRatio, 1 / this.baseRatio);
            this.scaleRatio = (this.scaleRatio - this.baseRatio) / (1 / this.baseRatio - this.baseRatio);
            if (this.realOrientation == EOrientationType.Horizontal) {
                this.margin = clamp(this.curRatio, 1, this.baseRatio);
                this.margin = (this.margin - 1) / (this.baseRatio - 1);
            } else {
                this.margin = clamp(this.curRatio, 1 / this.baseRatio, 1);
                this.margin = 1 - (this.margin - 1 / this.baseRatio) / (1 - 1 / this.baseRatio);
            }
            this.distanceToScreenBorders = new Vec2(this.orientation == EOrientationType.Horizontal ? -(0.5 * (curWindowSize.width) * (this.baseSize.height / curWindowSize.height) - (0.5 * this.baseSize.width)) : 0, this.Orientation == EOrientationType.Vertical ? -(0.5 * (curWindowSize.height) * (this.baseSize.width / curWindowSize.width) - (0.5 * this.baseSize.height)) : 0);
            this.windowSizeInCanvas = new Vec2(this.orientation == EOrientationType.Horizontal ? ((curWindowSize.width) * (this.baseSize.height / curWindowSize.height)) : this.baseSize.width, this.Orientation == EOrientationType.Vertical ? ((curWindowSize.height) * (this.baseSize.width / curWindowSize.width)) : this.baseSize.height);

            this.lastWindowSize = curWindowSize;
            this.upd();

        }
    }
    private async upd() {
        console.log("WindowScaler Upd");
        for (let i = 0; i < this.allListeners.length; i++) {
            this.allListeners[i].Recsale();
            console.log("widget Upd");
        }
    }
    private EqualSize(size1: Size, size2: Size): boolean {
        return size1.x == size2.x && size1.y == size2.y;
    }

    public On(widget: AdaptiveWidget) {
        this.allListeners.push(widget);
        widget.Recsale();
    }
    public Off(widget: AdaptiveWidget) {
        if (this.allListeners.contains(widget))
            this.allListeners.remove(widget);
    }
}