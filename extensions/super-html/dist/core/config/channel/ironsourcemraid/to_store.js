window.ToStore = function(auto = false) {
    super_log("ToStore ironsourcemraid");
    var url = "";
    var userAgent = navigator.userAgent || navigator.vendor;
    if (/android/i.test(userAgent)) {
        url = super_html.google_play_url;
        super_html.google_play_url || console.error("[super-html] not set google_play_url");
    }
    else {
        url = super_html.appstore_url;
        super_html.appstore_url || console.error("[super-html] not set appstore_url");
    }
    window.mraid ? mraid.open(url) : window.open(url, "_blank");
};
