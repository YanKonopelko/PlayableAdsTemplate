import { _decorator, Component, Enum, Vec2, Vec3, Widget, Node } from 'cc';
import { SoundDataBase } from './Sounds/SoundDataBase';
import { ESoundType } from './Sounds/SoundPreset';


const { ccclass, property, requireComponent, executeInEditMode } = _decorator;


@(ccclass("GameplayScene"))
export class GameplayScene extends Component {
    public static paused: boolean = false;
    protected start(): void {
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                GameplayScene.paused = true;
                console.log("PAUSE: вкладка скрыта");
            } else {
                GameplayScene.paused = false;
                console.log("RESUME: вкладка активна");
            }
        });
    }

    public PlaySound(){
        SoundDataBase.Instance.Play(ESoundType.None);
    }
}

