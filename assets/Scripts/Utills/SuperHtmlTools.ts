import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SuperHtmlTools')
export class SuperHtmlTools {

    private static readonly androidLink: string = "https://play.google.com/store/apps/details?id=com.custom.goescape&hl=en_US";
    private static readonly iosLink: string = "https://apps.apple.com/us/app/go-escape-casual-ball-games/id1435951901";


    public static ToStore() {

        const buildTypes = {
            SUPER_HTML: 'super-html'
        };

        const platformTypes = {
            APPLOVIN: 'applovin'
        };


        let buildMachine = 'No Build';
        let platform = 'develop';
        //@ts-ignore
        if (window.super_html_channel) {
            buildMachine = buildTypes.SUPER_HTML;
            //@ts-ignore
            platform = window.super_html_channel;
        }

        const userAgent = navigator.userAgent || navigator.vendor;
        let link = this.iosLink;
        if (/android/i.test(userAgent)) {
            link = this.androidLink;
        }

        //@ts-ignore
        if (buildMachine === buildTypes.SUPER_HTML && window.super_html !== undefined) {
            //@ts-ignore

            if (platform === platformTypes.APPLOVIN && window.mraid === undefined) {
                window.open(link);
            } else {
                //@ts-ignore
                super_html.appstore_url = this.iosLink;
                //@ts-ignore

                super_html.google_play_url = this.androidLink;
                //@ts-ignore

                window.super_html.download();
            }
        } else {
            window.open(link);
        }
        // if()
        //@ts-ignore
        if (window.gameEnd)
            //@ts-ignore
            window.gameEnd && window.gameEnd();
    }
}


