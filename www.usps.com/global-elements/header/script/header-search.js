var USPSGlobals = USPSGlobals || {};
USPSGlobals.Require = USPSGlobals.Require || {}, USPSGlobals.Require.requireGlobals = USPSRequireNS.require.config({
    baseUrl: "https://www.#/global-elements/lib/script",
    context: "global"
}), USPSGlobals.Require.requireHeader = USPSRequireNS.require.config({
    baseUrl: "https://www.#/global-elements/header/script/",
    context: "header",
    paths: {
        jquery: "https://www.#/global-elements/footer/script/jquery-3.7.1",
        "require-jquery": "https://www.#/global-elements/lib/script/require-jquery",
        helpers: "https://www.#/global-elements/lib/script/helpers"
    },
    waitSeconds: 30
}), USPSGlobals.Require.requireHeader(["require", "require-jquery", "helpers","search-fe"], function(e, t, n, r) {
    var i = function() {
        var t = function() {};
        t()
    }()
});