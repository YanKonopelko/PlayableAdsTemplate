window.callGoogleExit = function() {
    ExitApi.exit();
};
window.ToStore = function(auto = false) {
    super_log("ToStore google landscape");
    if (window.ExitApi && typeof ExitApi.exit === "function") {
        ExitApi.exit();
        return;
    }
    var clickTag = "";
    var userAgent = navigator.userAgent || navigator.vendor;
    if (/android/i.test(userAgent)) {
        clickTag = super_html.google_play_url;
        super_html.google_play_url || console.error("[super-html] not set google_play_url");
    }
    else {
        clickTag = super_html.appstore_url;
        super_html.appstore_url || console.error("[super-html] not set appstore_url");
    }
    window.open(clickTag);
};
