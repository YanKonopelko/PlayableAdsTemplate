import { Director } from "cc";

export class TimeUtils {
    public static readonly MS_IN_DAY: number = 86400000;
    public static readonly MS_IN_HOUR: number = 3600000;
    public static readonly MS_IN_MIN: number = 60000;
    public static readonly MS_IN_SEC: number = 1000;


    private static timeScale: number = 1;

    public static set TimeScale(val: number) {
        this.getOrCreateSlomoPolyfill();
        this.timeScale = val;
    }
    public static get TimeScale(): number {
        return this.timeScale;
    }

    public static RoundDate(input: Date): Date {
        if (input.getHours() >= 10)
            return new Date(input.getFullYear(), input.getMonth(), input.getDate() + 1);
        else
            return new Date(input.getFullYear(), input.getMonth(), input.getDate());
    }

    public static LoadDate(dateValue: string | number): Date {
        if (typeof dateValue == "number") {
            let date = new Date(dateValue);
            return TimeUtils.RoundDate(date);
        }
        if (typeof dateValue == "string") {
            let parts = dateValue.split("-");   // YYYY-MM-DD
            if (parts.length == 3)
                return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
            parts = dateValue.split("/")        // MM/DD/YYYY
            if (parts.length == 3)
                return new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
        }
        return null;
    }


    public static WaitFrame() {
        let start = Date.now();
        return new Promise((r: (lateness: number) => void, j) => setTimeout(() => {
            r((Date.now() - start) / 1000);
        }, 1 / 60));
    }

    public static Timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public static TimeoutSeconds(s: number) {
        return new Promise(resolve => setTimeout(resolve, s * 1000));
    }

    static DelaySeconds(s: number) {
        return new Promise(resolve => setTimeout(resolve, s * 1000));
    }

    public static WaitUntil(fn: () => boolean): Promise<void> {
        let checkDone = (onDone) => {
            setTimeout(() => {
                if (fn())
                    onDone();
                else
                    checkDone(onDone)
            }, 1000 / 10);
        }
        return new Promise<void>((resolve, reject) => {
            checkDone(resolve)
        })
    }
    static getOrCreateSlomoPolyfill = (() => {
        let polyfill: undefined | { multiplier: number; };

        return () => {
            if (!polyfill) {
                const polyfill_ = { multiplier: 1.0 };
                const tick = Director.prototype.tick;
                Director.prototype.tick = function (dt: number, ...args) {
                    tick.call(this, dt * TimeUtils.TimeScale, ...args);
                };
                polyfill = polyfill_;
            }
            return polyfill;
        };
    })();
}