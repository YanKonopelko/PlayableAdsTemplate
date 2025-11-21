import { TimeUtils } from "./TimeUtils";

export class FixedUpdateUtils {
    constructor() {
        const canvas = document.getElementById('GameCanvas') as HTMLCanvasElement;
        canvas?.addEventListener("focus", this.OnFocus.bind(this));
        canvas?.addEventListener("blur", this.OnBlur.bind(this));
    }


    private AllListeners: CallableFunction[] = [];
    private readonly fixedTimeStemp: number = 1 / 60;
    private lastUpdTime: number = 0;
    private canUpd: boolean = true;
    private stopTrigger: boolean = false;
    private UpdStart: boolean = false;
    public get FixedTimeStemp(): number {
        return this.fixedTimeStemp;
    }
    private async FixedUpdate() {
        while (true) {
            if (this.stopTrigger) {
                this.stopTrigger = false;
                return;
            }
            let timeBetween: number = 0;
            timeBetween = new Date().valueOf() - this.lastUpdTime;
            if (timeBetween > 100)
                timeBetween = 33
            this.lastUpdTime = new Date().valueOf();
            let dt: number = this.fixedTimeStemp * timeBetween / 16.7;

            if (this.canUpd) {
                for (let i = 0; i < this.AllListeners.length; i++) {
                    let func = this.AllListeners[i];
                    func(dt);
                }
            }

            await TimeUtils.Timeout(this.fixedTimeStemp * 1000);
        }
    }

    public StopFixedUpdate() {
        this.stopTrigger = true;
    }


    public On(func: CallableFunction) {
        this.AllListeners.push(func);
        if (!this.UpdStart) {
            this.UpdStart = true;

            this.FixedUpdate();
        }
    }
    public Off(callback: CallableFunction) {
        if (this.AllListeners.contains(callback))
            this.AllListeners.remove(callback);
        if (this.AllListeners.length == 0) {
            this.StopFixedUpdate();
            this.UpdStart = false;
        }
    }

    private OnFocus(any) {
        if (this.canUpd) return;
        this.canUpd = true;
    }

    private OnBlur(any) {
        if (!this.canUpd) return;
        this.canUpd = false;
    }
}
export const FixedUpdater = new FixedUpdateUtils();
