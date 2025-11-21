import { _decorator, Component, Enum, Vec2, Vec3, Widget, Node } from 'cc';
import { TimeUtils } from '../TimeUtils';
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
    @property({ visible: true, type: EHorizontalAlignmentType }) public HorizontalAligment: EHorizontalAlignmentType = EHorizontalAlignmentType.None;
    @property({ type: Number, visible: function (this) { return this.HorizontalAligment == EHorizontalAlignmentType.Left }, range: [-1, 1], step: 0.01 }) public left: number = 0;
    @property({ type: Number, visible: function (this) { return this.HorizontalAligment == EHorizontalAlignmentType.Right }, range: [-1, 1], step: 0.01 }) public right: number = 0;


    @property({ visible: true, type: EVerticalAlignmentType }) public VerticalAligment: EVerticalAlignmentType = EVerticalAlignmentType.None;
    @property({ type: Number, visible: function (this) { return this.VerticalAligment == EVerticalAlignmentType.Top }, range: [-1, 1], step: 0.01 }) public top: number = 0;
    @property({ type: Number, visible: function (this) { return this.VerticalAligment == EVerticalAlignmentType.Bottom }, range: [-1, 1], step: 0.01 }) public bottom: number = 0;


    @property({ type: Number, visible: true }) public Ratio: number = 1;
    @property({ type: Number, visible: true, range: [0, Infinity], step: 0.01 }) public Scale: number = 1;
    @property({ type: String, visible: true }) public Name: string = "name";

    public ToObject() {
        var object = {
            horizontalAligmentV: this.HorizontalAligment,
            leftV: this.left,
            rightV: this.right,
            verticalAligmentV: this.VerticalAligment,
            topV: this.top,
            botobV: this.bottom,
            scale: this.Scale,
            Ratio: this.Ratio
        };
        return object;
    }
}


@ccclass('AdaptiveWidget')
@executeInEditMode(true)
@requireComponent(Widget)
export class AdaptiveWidget extends Component {
    @property([AdaptiveWidgetParams]) private paramsVariants: AdaptiveWidgetParams[] = [];

    private curParams: AdaptiveWidgetParams = null;

    private lastChangedParams: object = null;
    private isInit: boolean = false;
    private widget: Widget = null;

    protected async start() {
        await TimeUtils.WaitUntil(() => { return !!WindowsScaler.Instance });
        this.widget = this.node.getComponent(Widget);
        if (!this.widget.target) {
            this.widget.target = director.getScene().getComponentInChildren(Canvas).node;
        }
        WindowsScaler.Instance.OnUpdate.Subscribe(this.Recsale, this);
        this.isInit = true;

        if (EDITOR) {
            if (this.paramsVariants.length == 0) {
                var param = new AdaptiveWidgetParams();
                param.Name = "NearZero";
                param.Ratio = 0.1;
                this.paramsVariants.push(param);
                var param = new AdaptiveWidgetParams();
                param.Name = "Vertical";
                param.Ratio = 0.56;
                this.paramsVariants.push(param);
                var param = new AdaptiveWidgetParams();
                param.Name = "Horizontal";
                param.Ratio = 1.2;
                this.paramsVariants.push(param);
            }
        }

        this.Recsale();
    }

    public Recsale() {

        var maxRate: number = 0;
        this.paramsVariants.forEach(element => {
            if (element.Ratio <= WindowsScaler.Instance.CurrentRatio && element.Ratio >= maxRate) {
                maxRate = element.Ratio;
                this.curParams = element;
            }
        });
        if (!this.curParams) return;

        this.widget.isAlignBottom = this.curParams.VerticalAligment == EVerticalAlignmentType.Bottom;
        this.widget.isAlignTop = this.curParams.VerticalAligment == EVerticalAlignmentType.Top;
        this.widget.isAlignVerticalCenter = this.curParams.VerticalAligment == EVerticalAlignmentType.Center;
        this.widget.isAlignLeft = this.curParams.HorizontalAligment == EHorizontalAlignmentType.Left;
        this.widget.isAlignRight = this.curParams.HorizontalAligment == EHorizontalAlignmentType.Right;
        this.widget.isAlignHorizontalCenter = this.curParams.HorizontalAligment == EHorizontalAlignmentType.Center;

        this.widget.left = this.curParams.HorizontalAligment == EHorizontalAlignmentType.Left ? WindowsScaler.Instance.CanvasWindowSize.x * this.curParams.left : 0;
        this.widget.right = this.curParams.HorizontalAligment == EHorizontalAlignmentType.Right ? WindowsScaler.Instance.CanvasWindowSize.x * this.curParams.right : 0;
        this.widget.top = this.curParams.VerticalAligment == EVerticalAlignmentType.Top ? WindowsScaler.Instance.CanvasWindowSize.y * this.curParams.top : 0;
        this.widget.bottom = this.curParams.VerticalAligment == EVerticalAlignmentType.Bottom ? WindowsScaler.Instance.CanvasWindowSize.y * this.curParams.bottom : 0;

        let size = this.curParams.Scale;

        this.node.setScale(size, size);

    }

    protected update(dt: number): void {
        if (!this.isInit) return;
        if (EDITOR) {
            if (!this.curParams) return;
            var obj = this.curParams.ToObject();
            if (JSON.stringify(this.lastChangedParams) != JSON.stringify(obj)) {
                this.lastChangedParams = obj;
                this.Recsale();
            }
        }

    }

    protected onDestroy(): void {
        WindowsScaler.Instance.OnUpdate.UnSubscribe(this.Recsale, this);
    }
}

