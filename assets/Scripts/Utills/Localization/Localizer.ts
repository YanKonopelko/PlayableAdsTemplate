import { Component, JsonAsset, _decorator } from "cc";
const { ccclass, property } = _decorator;

export enum ELanguage {
    Eng = "en",
    Esp = "es",
    De = "de",
    It = "it",
    Fr = "fr",
    Jap = "ja",
    Ko = "ko",
    PortPort = 'pt-PT',
    PortBr = "pt-BR"
}

// • Испанский
// • Немецкий
// • Итальянский
// • Французский
// • Японский
// • Корейский
// • Португальский Португалия
// • Португальский Бразилия
@ccclass('Localizer')
export class Localizer extends Component {
    @property({ type: [JsonAsset] }) private jsons: JsonAsset[] = [];
    public curLanguage: ELanguage = ELanguage.Eng;
    private static readonly GROUPS_KEY: string = "Groups";

    private _languages: Set<ELanguage> = new Set<ELanguage>();
    private _dictionary: Map<ELanguage, Map<string, string>> = new Map<ELanguage, Map<string, string>>();

    private static instance: Localizer = null;
    public static get Instance() {
        return this.instance;
    }

    protected start(): void {
        this.jsons.forEach(json => {
            let arr = json.json[Localizer.GROUPS_KEY];
            arr.forEach(element => {
                let languageGroup = element["LG"];
                let language = languageGroup["L"];
                const langKey = Object.keys(ELanguage).find(k => ELanguage[k as keyof typeof ELanguage] === language);

                let keyValuePairs = languageGroup["KVP"];
                keyValuePairs.forEach(kvp => {
                    var map = this._dictionary.get(ELanguage[langKey]); 
                    if(!map){
                        map = new Map<string, string>();
                        this._dictionary.set(ELanguage[langKey],map);
                    }
                    map.set(kvp["key"],kvp["value"]);
                });
            });
        });
        Localizer.instance = this;
        console.log("a");
    }

    public Get(key: string): string {
        var dict = this._dictionary.get(this.curLanguage);
        if(!dict) return key;
        var value = dict.get(key);
        if(!value) key;
        return value;
    }
}



