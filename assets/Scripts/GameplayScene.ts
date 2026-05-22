import { _decorator, Component, Enum, Vec2, Vec3, Widget, Node } from 'cc';
import { SoundManager } from './Sounds/SoundManager';
import { ESoundType } from './Sounds/SoundPreset';


const { ccclass, property, requireComponent, executeInEditMode } = _decorator;


@(ccclass("GameplayScene"))
export class GameplayScene extends Component {
    public static paused: boolean = false;

    private tapCount = 3;
    private readonly androidLink: string = "https://play.google.com/store/apps/details?id=com.rockbite.zombieoutpost";
    private readonly iosLink: string = "https://apps.apple.com/us/app/idle-outpost-zombie-apocalypse/id6463128982";
    protected async start(): Promise<void> {
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                GameplayScene.paused = true;
                console.log("PAUSE: вкладка скрыта");
            } else {
                GameplayScene.paused = false;
                console.log("RESUME: вкладка активна");
            }
        });
        await SoundManager.Instance.Init();
        SoundManager.Instance.PlayMusic(ESoundType.Music);
    }

    public PlaySound() {
        SoundManager.Instance.Play(ESoundType.None);
        this.ToStore();
    }

    public ToStore() {
        window.ToStore?.();
    }
}

