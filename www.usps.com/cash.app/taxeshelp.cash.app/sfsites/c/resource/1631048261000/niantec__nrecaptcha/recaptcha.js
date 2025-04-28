var niverifyCallback = function(token) {
    document.dispatchEvent(new CustomEvent('nirecaptchaVerified', {'detail': {response: token}}));
};
var niexpireCallback = function() {
    document.dispatchEvent(new Event('nirecaptchaExpired'));
};
var nierrorCallback = function() {
    document.dispatchEvent(new Event('nirecaptchaError'));
};
document.addEventListener('nirecaptchaRender', function(e) {
    if(e.detail.captchaType=='v2-checkbox'){
        grecaptcha.render(e.detail.element, {
            'sitekey': e.detail.siteKey,
            'callback': niverifyCallback,
            'expired-callback': niexpireCallback,
            'error-callback': nierrorCallback
        });
    }
    if(e.detail.captchaType=='v2-invisible'){
        grecaptcha.render(e.detail.element, {
            'sitekey': e.detail.siteKey,
            'callback': niverifyCallback,
            'error-callback': nierrorCallback,
            'size': 'invisible',
            'badge': e.detail.hasOwnProperty('badge') ? e.detail.badge : 'bottomright'
        });
    }
});
document.addEventListener('nirecaptchaReset', function() {
    grecaptcha.reset();
});
document.addEventListener('nirecaptchaExecute', function(e) {
    if(e.detail.captchaType=='v2-invisible'){
        grecaptcha.execute();
    }
    if(e.detail.captchaType=='v3'){
        grecaptcha.execute(e.detail.siteKey, {
            action: e.detail.action
        }).then(function(token) {
            document.dispatchEvent(new CustomEvent('nirecaptchaVerified', {'detail': {response: token, action:e.detail.action}}));
        }).catch(error=>{
           // Do Nothing
        });
    }
}); 