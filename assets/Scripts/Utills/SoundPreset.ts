import { CCString } from "cc";
import { CCBoolean } from "cc";
import { CCInteger } from "cc";
import { Enum } from "cc";
import { AudioClip, CCFloat, _decorator } from "cc";
import { Utils } from "./Utils";

const { ccclass, property } = _decorator;

export enum ESoundType{
    None,
}

@ccclass('SoundPreset')
export class SoundPreset {
    @property({ visible: true, type: Enum(ESoundType) }) public soundType: ESoundType = ESoundType.None;

    @property({type:CCString,visible:true}) public PathPlusSoundName:string = "FolderName/AudioName";
    @property({type:CCString,visible:true}) public bundleName:string = "Audio";

    @property({ type: CCBoolean }) isNecessary: boolean = true;
    @property({ type: Number, range: [0, 1] }) volume: number = 0.5;
    public HasLoaded:boolean = false;
    public clip: AudioClip = null;

    public async LoadClip(){
        this.clip = await Utils.LoadAudio(this.PathPlusSoundName,"",this.bundleName);
        this.HasLoaded = true;
    }

}