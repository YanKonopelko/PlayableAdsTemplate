import { _decorator, Component, Enum, Vec2, Vec3, Widget, Node } from 'cc';
import { TimeUtils } from './TimeUtils';
import { director } from 'cc';
import { Canvas } from 'cc';
import { WindowsScaler } from './WindowsScaler';
import { EDITOR } from 'cc/env';

const { ccclass, property, requireComponent, executeInEditMode } = _decorator;

enum EHorizontalAlignmentType {
    None,
    Left,
    Right,
    Center
}
enum EVerticalAlignmentType {
    None,
    Top,
    Bottom,
    Center
}
Enum(EHorizontalAlignmentType)
Enum(EVerticalAlignmentType)
@(ccclass("AdaptiveWidgetParams"))
export class AdaptiveWidgetParams {
    @property({ visible: true, type: EHorizontalAlignmentType, group: { id: "0", name: "Horizontal layout", style: "section" } }) public HorizontalAligmentH: EHorizontalAlignmentType = EHorizontalAlignmentType.None;
    @property({ type: Number, visible: function (this) { return this.HorizontalAligmentH == EHorizontalAlignmentType.Left }, group: { id: "0", name: "Horizontal layout", style: "section" }, range: [0, 1], step: 0.01 }) public leftH: number = 0;
    @property({ type: Number, visible: function (this) { return this.HorizontalAligmentH == EHorizontalAlignmentType.Right }, group: { id: "0", name: "Horizontal layout", style: "section" }, range: [0, 1], step: 0.01 }) public rightH: number = 0;
    @property({ type: Boolean, visible: function (this) { return this.HorizontalAligmentH !== EHorizontalAlignmentType.None }, group: { id: "0", name: "Horizontal layout", style: "section" } }) public DynamicHorizontalMarginH: boolean = false;

    @property({ visible: true, type: EVerticalAlignmentType, group: { id: "0", name: "Horizontal layout", style: "section" } }) public VerticalAligmentH: EVerticalAlignmentType = EVerticalAlignmentType.None;
    @property({ type: Number, visible: function (this) { return this.VerticalAligmentH == EVerticalAlignmentType.Top }, group: { id: "0", name: "Horizontal layout", style: "section" }, range: [0, 1], step: 0.01 }) public topH: number = 0;
    @property({ type: Number, visible: function (this) { return this.VerticalAligmentH == EVerticalAlignmentType.Bottom }, group: { id: "0", name: "Horizontal layout", style: "section" }, range: [0, 1], step: 0.01 }) public bottomH: number = 0;
    @property({ type: Boolean, visible: function (this) { return this.VerticalAligmentH !== EVerticalAlignmentType.None }, group: { id: "0", name: "Horizontal layout", style: "section" } }) public DynamicVerticalMarginH: boolean = false;

    @property({ type: Number, visible: true, group: { id: "0", name: "Horizontal layout", style: "section" }, range: [0, Infinity], step: 0.01 }) public ScaleH: number = 1;


    @property({ visible: true, type: EHorizontalAlignmentType, group: { id: "0", name: "Vertical layout", style: "section" } }) public HorizontalAligmentV: EHorizontalAlignmentType = EHorizontalAlignmentType.None;
    @property({ type: Number, visible: function (this) { return this.HorizontalAligmentV == EHorizontalAlignmentType.Left }, group: { id: "0", name: "Vertical layout", style: "section" }, range: [0, 1], step: 0.01 }) public leftV: number = 0;
    @property({ type: Number, visible: function (this) { return this.HorizontalAligmentV == EHorizontalAlignmentType.Right }, group: { id: "0", name: "Vertical layout", style: "section" }, range: [0, 1], step: 0.01 }) public rightV: number = 0;
    @property({ type: Boolean, visible: function (this) { return this.HorizontalAligmentV !== EHorizontalAlignmentType.None }, group: { id: "0", name: "Vertical layout", style: "section" } }) public DynamicHorizontalMarginV: boolean = false;

    @property({ visible: true, type: EVerticalAlignmentType, group: { id: "0", name: "Vertical layout", style: "section" } }) public VerticalAligmentV: EVerticalAlignmentType = EVerticalAlignmentType.None;
    @property({ type: Number, visible: function (this) { return this.VerticalAligmentV == EVerticalAlignmentType.Top }, group: { id: "0", name: "Vertical layout", style: "section" }, range: [0, 1], step: 0.01 }) public topV: number = 0;
    @property({ type: Number, visible: function (this) { return this.VerticalAligmentV == EVerticalAlignmentType.Bottom }, group: { id: "0", name: "Vertical layout", style: "section" }, range: [0, 1], step: 0.01 }) public bottomV: number = 0;
    @property({ type: Boolean, visible: function (this) { return this.VerticalAligmentV !== EVerticalAlignmentType.None }, group: { id: "0", name: "Vertical layout", style: "section" } }) public DynamicVerticalMarginV: boolean = false;

    @property({ type: Number, visible: true, group: { id: "0", name: "Vertical layout", style: "section" }, range: [0, Infinity], step: 0.01 }) public ScaleV: number = 1;

    public ToObject() {
        var object = {
            horizontalAligmentH: this.HorizontalAligmentH,
            leftH: this.leftH,
            rightH: this.rightH,
            dynamicHorizontalMarginH: this.DynamicHorizontalMarginH,
            verticalAligmentH: this.VerticalAligmentH,
            topH: this.topH,
            bottomH: this.bottomH,
            dynamicVerticalMarginH: this.DynamicVerticalMarginH,
            scaleH: this.ScaleH,
            horizontalAligmentV: this.HorizontalAligmentV,
            leftV: this.leftV,
            rightV: this.rightV,
            dynamicHorizontalMarginV: this.DynamicHorizontalMarginV,
            verticalAligmentV: this.VerticalAligmentV,
            topV: this.topV,
            botobV: this.bottomV,
            dynamicVerticalMarginV: this.DynamicVerticalMarginV,
            scaleV: this.ScaleV
        };
        return object;
    }
}


@ccclass('AdaptiveWidget')
// @executeInEditMode(true)
@requireComponent(Widget)
export class AdaptiveWidget extends Component {


    @property(AdaptiveWidgetParams) private params: AdaptiveWidgetParams = new AdaptiveWidgetParams();

    private lastChangedParams: object = null;
    private isInit: boolean = false;
    private widget: Widget = null;
    // private 

    protected async start() {
        await TimeUtils.WaitUntil(() => { return !!WindowsScaler.Instance });
        this.widget = this.node.getComponent(Widget);
        if (!this.widget.target) {
            this.widget.target = director.getScene().getComponentInChildren(Canvas).node;
        }
        WindowsScaler.Instance.On(this);
        this.isInit = true;
    }

    public Recsale() {

        let size = this.params.ScaleH + ((this.params.ScaleV - this.params.ScaleH) * WindowsScaler.Instance.UIScale);
        this.node.setScale(size, size);

        switch (WindowsScaler.Instance.Realorientation) {
            case 0: {
                this.widget.isAlignBottom = this.params.VerticalAligmentH == EVerticalAlignmentType.Bottom;
                this.widget.isAlignTop = this.params.VerticalAligmentH == EVerticalAlignmentType.Top;
                this.widget.isAlignVerticalCenter = this.params.VerticalAligmentH == EVerticalAlignmentType.Center;
                this.widget.isAlignLeft = this.params.HorizontalAligmentH == EHorizontalAlignmentType.Left;
                this.widget.isAlignRight = this.params.HorizontalAligmentH == EHorizontalAlignmentType.Right;
                this.widget.isAlignHorizontalCenter = this.params.HorizontalAligmentH == EHorizontalAlignmentType.Center;

                this.widget.left = this.params.HorizontalAligmentH == EHorizontalAlignmentType.Left ? WindowsScaler.Instance.ScreenBorders.x + WindowsScaler.Instance.CanvasWindowSize.x * this.params.leftH * (this.params.DynamicHorizontalMarginH ? WindowsScaler.Instance.MarginScale : 1) : 0;
                this.widget.right = this.params.HorizontalAligmentH == EHorizontalAlignmentType.Right ? WindowsScaler.Instance.ScreenBorders.x + WindowsScaler.Instance.CanvasWindowSize.x * this.params.rightH * (this.params.DynamicHorizontalMarginH ? WindowsScaler.Instance.MarginScale : 1) : 0;
                this.widget.top = this.params.VerticalAligmentH == EVerticalAlignmentType.Top ? WindowsScaler.Instance.ScreenBorders.y + WindowsScaler.Instance.CanvasWindowSize.y * this.params.topH * (this.params.DynamicVerticalMarginH ? WindowsScaler.Instance.MarginScale : 1) : 0;
                this.widget.bottom = this.params.VerticalAligmentH == EVerticalAlignmentType.Bottom ? WindowsScaler.Instance.ScreenBorders.y + WindowsScaler.Instance.CanvasWindowSize.y * this.params.bottomH * (this.params.DynamicVerticalMarginH ? WindowsScaler.Instance.MarginScale : 1) : 0;
                break;
            }
            case 1: {
                this.widget.isAlignBottom = this.params.VerticalAligmentV == EVerticalAlignmentType.Bottom;
                this.widget.isAlignTop = this.params.VerticalAligmentV == EVerticalAlignmentType.Top;
                this.widget.isAlignVerticalCenter = this.params.VerticalAligmentV == EVerticalAlignmentType.Center;
                this.widget.isAlignLeft = this.params.HorizontalAligmentV == EHorizontalAlignmentType.Left;
                this.widget.isAlignRight = this.params.HorizontalAligmentV == EHorizontalAlignmentType.Right;
                this.widget.isAlignHorizontalCenter = this.params.HorizontalAligmentV == EHorizontalAlignmentType.Center;

                this.widget.left = this.params.HorizontalAligmentV == EHorizontalAlignmentType.Left ? WindowsScaler.Instance.ScreenBorders.x + WindowsScaler.Instance.CanvasWindowSize.x * this.params.leftV * (this.params.DynamicHorizontalMarginV ? WindowsScaler.Instance.MarginScale : 1) : 0;
                this.widget.right = this.params.HorizontalAligmentV == EHorizontalAlignmentType.Right ? WindowsScaler.Instance.ScreenBorders.x + WindowsScaler.Instance.CanvasWindowSize.x * this.params.rightV * (this.params.DynamicHorizontalMarginV ? WindowsScaler.Instance.MarginScale : 1) : 0;
                this.widget.top = this.params.VerticalAligmentV == EVerticalAlignmentType.Top ? WindowsScaler.Instance.ScreenBorders.y + WindowsScaler.Instance.CanvasWindowSize.y * this.params.topV * (this.params.DynamicVerticalMarginV ? WindowsScaler.Instance.MarginScale : 1) : 0;
                this.widget.bottom = this.params.VerticalAligmentV == EVerticalAlignmentType.Bottom ? WindowsScaler.Instance.ScreenBorders.y + WindowsScaler.Instance.CanvasWindowSize.y * this.params.bottomV * (this.params.DynamicVerticalMarginV ? WindowsScaler.Instance.MarginScale : 1) : 0;
                break;
            }
        }
    }

    protected update(dt: number): void {
        // if(this.params)
        if (!this.isInit) return;
        if (EDITOR) {
            var obj = this.params.ToObject();
            if (JSON.stringify(this.lastChangedParams) != JSON.stringify(obj)) {
                this.lastChangedParams = obj;
                this.Recsale();
                console.log("Auto Rescale");
            }
        }

    }

    protected onDestroy(): void {
        WindowsScaler.Instance.Off(this);
    }
}

