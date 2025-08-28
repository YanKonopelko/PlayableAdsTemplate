import { _decorator, Component, Node } from 'cc';
import { ESoundType, SoundPreset } from './SoundPreset';
import { AudioSource } from 'cc';
import { director } from 'cc';
import { AudioClip } from 'cc';
import { NodeEventType } from 'cc';
import { TimeUtils } from './TimeUtils';
const { ccclass, property } = _decorator;

@ccclass('SoundDataBase')
export class SoundDataBase extends Component {

    @property({ type: [SoundPreset] }) presets: SoundPreset[] = [];
    @property({ type: AudioSource }) public musicSource: AudioSource;
    @property({ type: AudioSource }) public soundSource: AudioSource;

    private presetMap: Map<ESoundType, SoundPreset> = new Map<ESoundType, SoundPreset>();

    private stopableSources: Map<ESoundType, AudioSource> = new Map<ESoundType, AudioSource>();


    private _soundMuted: boolean = false;
    private _musicEnabled: boolean = true;
    private _originalVolume: number = 1;

    public get soundMuted(): boolean {
        return this._soundMuted;
    }
    public get musicEnabled(): boolean {
        return this._musicEnabled;
    }
    public set soundMuted(value) {
        this._soundMuted = value;
        if (!value) this.soundSource.volume = 0;

    }
    public set musicEnabled(value) {
        this._musicEnabled = value;
        this.musicSource.volume = value ? this._originalVolume : 0;
    }

    private static instance: SoundDataBase = null;

    public static get Instance(): SoundDataBase {
        return this.instance;
    }

    async start() {
        if (SoundDataBase.instance) {
            this.node.destroy();
            return;
        }
        SoundDataBase.instance = this;
        this.presets.forEach(element => {
            this.presetMap.set(element.soundType, element);
        });
        director.addPersistRootNode(this.node);
        await this.Init();
    }

    public async Init() {
        let neccesarySoundsAwait: Promise<void>[] = [];
        this.presets.forEach(element => {
            if (element.isNecessary) {
                neccesarySoundsAwait.push(element.LoadClip());
            }
        });

        await Promise.all(neccesarySoundsAwait);
        this.LoadAllClips()

    }

    public LoadAllClips() {
        this.presets.forEach(element => {
            element.LoadClip();
        });
    }

    public Play(type: ESoundType, isStopable: boolean = false) {
        let preset = this.presetMap.get(type);
        if (!preset) {
            console.warn(`Have no presets for type: ${type}`);
            return
        }

        if (!preset.HasLoaded) {
            console.warn(`Preset for type: ${type} is not loaded yet`);
            return
        }

        if (isStopable) {
            this.PlayStopableSound(preset);
        }
        else {
            this.PlayLocal(preset);
        }

    }


    private PlayLocal(preset: SoundPreset) {
        if (this._soundMuted) return;
        let clip: AudioClip = preset.clip;
        let volume: number = preset.volume;

        if (clip == null)
            return;

        

        this.soundSource.volume = volume;
        this.soundSource.playOneShot(clip);
    }

    public PlayMusic(type: ESoundType) {
        let preset = this.presetMap.get(type);
        if (!preset) {
            console.warn(`Have no presets for type: ${type}`);
            return
        }

        if (!preset.HasLoaded) {
            console.warn(`Preset for type: ${type} is not loaded yet`);
            return
        }

        this.PlayMusicLocal(preset);
    }

    public PauseMusic() {
        if (this.musicSource && this.musicSource.playing) {
            this.musicSource.pause();
        }
    }

    public ResumeMusic() {
        if (this.musicSource && !this.musicSource.playing && this.musicSource.clip) {
            this.musicSource.play();
        }
    }

    private currentMusic: ESoundType = null;
    private PlayMusicLocal(preset: SoundPreset) {
        if (!this._musicEnabled) return;

        let clip: AudioClip = preset.clip;
        let volume: number = preset.volume;

        if (clip == null)
            return;

        if (this.musicSource.playing && this.musicSource.clip && this.currentMusic === preset.soundType) {
            return;
        }

        this.musicSource.volume = volume;
        this._originalVolume = volume;
        this.musicSource.loop = true;
        this.musicSource.stop();
        this.musicSource.clip = clip;
        this.musicSource.play();
    }

    private stopableSoundsSources: AudioSource[] = [];

    private async PlayStopableSound(preset: SoundPreset) {
        if (this._soundMuted) return;
        let clip: AudioClip = preset.clip;
        let volume: number = preset.volume;

        if (clip == null)
            return;

        let source: AudioSource = null;
        let playNow:boolean = false;    
        this.stopableSoundsSources.forEach(element => {
            if (element.clip == clip) {
                source = element;
                playNow = true;
                return;
            }
        });

        if(playNow)
            return;

        this.stopableSoundsSources.forEach(element => {
            if (!element.playing) {
                source = element;
                return;
            }
        });

        if (source == null) {
            source = this.addComponent(AudioSource);
            this.stopableSoundsSources.push(source);
        }

        this.stopableSources.set(preset.soundType, source);
        source.volume = volume;
        source.clip = clip;
        source.play();
        await TimeUtils.TimeoutSeconds(clip.getDuration());
        if (source.clip != null && clip == source.clip) {
            this.StopStopableSound(preset.soundType);
        }
    }

    public StopStopableSound(type: ESoundType) {
        if (this.stopableSources.has(type)) {
            let source = this.stopableSources.get(type);
            source.stop();
            source.clip = null;
            this.stopableSources.delete(type);
        }
    }

}