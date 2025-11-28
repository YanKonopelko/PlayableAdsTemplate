import { _decorator, Component, Enum, Label, Node } from 'cc';
import { ELanguage, Localizer } from './Localizer';
const { ccclass, property } = _decorator;

@ccclass('LocalizeText')
export class LocalizeText extends Component {
    @property(Label) private label: Label = null;
    @property(String) private key: string = 'key';
    start() {
        this.label = this.getComponent(Label);
        if(!this.label) return;
        var str = "";

        str = Localizer.Instance.Get(this.key);
        if(str == "key") return;
        this.label.string = str;
    }

}


