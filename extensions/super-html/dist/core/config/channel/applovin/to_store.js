window.ToStore = function(auto = false) {
    super_log("ToStore applovin");
    window.mraid ? mraid.open() : window.open(super_html && (super_html.google_play_url || super_html.appstore_url), "_blank");
};
